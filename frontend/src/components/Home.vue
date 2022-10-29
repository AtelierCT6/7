<template>
  <div>
    <!--  Header -->
    <div class="logo">
      <img src="..\assets\icon-left-font-monochrome-black.png" alt="logo">
    </div>
    <div class="content">
      <!-- Hidden Edit Form -->
      <div id="modifyPost">
        <form>
          <div>
            <label>Créer une Publication :</label>
            <textarea placeholder="Créer une Publication..." required v-model="modify.content"></textarea>
          </div>
          <div>
            <label>Ajoutez une Photo :</label>
            <input type="file" accept="image/*" @change="imgUpdate">
          </div>
          <button @click.prevent="modifyPost">Envoyez votre publication</button>
        </form>
      </div>
      <div id="bg"></div>
      <!-- Sidebar menu area -->
      <div class="sidebar">
        <div class="welcome" :dataSource='userInfo'>
          <h3>Bienvenue  {{ userInfo.firstName }}</h3>
        </div>
        <ul class="menu">
          <li>Accueil</li>
          <li>À Propos</li>
          <li><a href="mailto:test@test.com">Nous Contacter</a></li>
          <li @click="logout">Se Déconnecter</li>
        </ul>
      </div>
      <!-- Posts Area -->
      <div class="posts">
        <!-- Create Posts -->
        <form>
          <div>
            <label>Créer une Publication :</label>
            <textarea placeholder="Créer une Publication..." required v-model="postContent"></textarea>
          </div>
          <div>
            <label>Ajoutez une Photo :</label>
            <input type="file" accept="image/*" @change="imgUpload">
          </div>
          <button @click.prevent="createPost">Envoyez votre publication</button>
        </form>
        <!-- Show Posts -->
        <ul :dataSource='posts && userInfo'>
          <div v-for='post in posts' :key='post'>
            <li v-if='post.moderated === false || userInfo.isAdmin === true'>
              <div class="controlPost" :data-id="post._id" v-if="post.userId._id === userInfo._id || userInfo.isAdmin === true" >
                <span class="changes" @click="editPost">Edit |</span>
                <span class="changes" @click="deletePost"> Delete</span>
                <span v-if="userInfo.isAdmin === true && post.moderated === false" @click="hidePost"> | Hide</span>
                <span v-if="userInfo.isAdmin === true && post.moderated === true" @click="showPost">| Unhide</span>
              </div>
              <p>{{ post.content }}</p>
              <div v-if='post.hasOwnProperty("imageUrl")'>
                <img :src="post.imageUrl" alt="">
              </div>
              <div class="postFooter">
                <span>posté par {{ post.userId.firstName }} {{ post.userId.lastName }} </span>
                <span> {{ post.like }}
                  <i class="coeur" @click="likePost" :data-id="post._id">❤</i>
                </span>
              </div>
            </li>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      postContent: '',
      postImg: null,
      modify: {
        _id: '',
        content: '',
        imageUrl: null
      }
    }
  },
  created() {
    this.$store.dispatch('getUserInfo')
    this.$store.dispatch('getAllPosts')
  },
  computed: {
    ...mapState(['userInfo', 'posts'])
  },
  methods: {
    imgUpload(e) {
      this.postImg = e.target.files[0]
    },
    async createPost() {
      if (this.postContent.trim() === '') return
      const newPost = new FormData()
      if (this.postImg !== null) {
        newPost.append('inputFile', this.postImg)
      }
      newPost.append('content', this.postContent)
      await this.$http.post('api/post', newPost)
      this.$router.go(0)
    },
    editPost(e) {
      document.getElementById('bg').style.display = 'block'
      document.getElementById('modifyPost').style.display = 'block'
      this.modify._id = e.target.parentElement.dataset.id
      const post = this.posts.find(({ _id }) => _id === this.modify._id)
      this.modify.content = post.content
      if (post.imageUrl !== undefined) {
        this.modify.imageUrl = post.imageUrl
      }
    },
    imgUpdate(e) {
      this.modify.imageUrl = e.target.files[0]
    },
    async modifyPost() {
      const modifyPost = new FormData()
      if (this.modify.imageUrl !== null) {
        if (this.modify.imageUrl.name !== undefined) {
          modifyPost.append('inputFile', this.modify.imageUrl)
        } else {
          modifyPost.append('imageUrl', this.modify.imageUrl)
        }
      }
      modifyPost.append('content', this.modify.content)
      await this.$http.put('api/post/' + this.modify._id, modifyPost)
      this.$router.go(0)
    },
    async deletePost(e) {
      const isConfirm = confirm('Are you sure to delete?')
      if (!isConfirm) return
      await this.$http.delete('api/post/' + e.target.parentElement.dataset.id)
      this.$router.go(0)
    },
    async hidePost(e) {
      await this.$http.put('api/post/' + e.target.parentElement.dataset.id + '/moderated', { hide: 1 })
      this.$router.go(0)
    },
    async showPost(e) {
      await this.$http.put('api/post/' + e.target.parentElement.dataset.id + '/moderated', { hide: 0 })
      this.$router.go(0)
    },
    async likePost(e) {
      const post = this.posts.find(({ _id }) => _id === e.target.dataset.id)
      let likes
      if (post.likedBy.indexOf(this.userInfo._id) === -1) {
        likes = 1
      } else {
        likes = 0
      }
      await this.$http.post('api/post/' + e.target.dataset.id + '/likes', { likes: likes, userId: localStorage.getItem('userId') })
      this.$router.go(0)
    },
    async logout() {
      const isConfirm = confirm('Do you want to logout?')
      if (!isConfirm) return
      localStorage.clear()
      await this.$http.put('api/user/logout', { userId: localStorage.getItem('userId') })
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
a {
  color: inherit;
  text-decoration: none;
}
/* HEADER AREA */
.logo {
  position: fixed;
  margin: 0 auto;
  top: 0;
  width:100%;
  height: 150px;
  z-index: 2;
  background-color:#eee;
}
.logo img {
  position: absolute;
  left:5%;
  width: 485px;
  top:-175px;
}
.content{
  position: relative;
  display: flex;
  top: 150px;
}

/* HIDDEN EDIT FORM */
#bg {
  width: 100%;
  height: 2000px;
  background: #000;
  opacity: 0.6;
  z-index: 4;
  display: none;
}
#modifyPost {
  position: fixed;
  top: 300px;
  left: 25%;
  z-index: 5;
  width: 55%;
  height: 200px;
  background-color: #fff;
  border: 1px solid black;
  border-radius: 10px;
  padding: 5px;
  display: none;
}
#modifyPost form textarea{
  height: 140px;
}
/* SIDEBAR MENU AREA */
.sidebar{
  width: 18%;
  padding: 0 3%;
  position: fixed;
}
.menu {
  list-style-type: none;
  text-align: center;
  cursor: pointer;
}
.menu li{
  background: white;
  border-radius: 10px;
  margin: 10px 0;
  padding: 5px;
  font-size: 600;
}
/* CREATE + SHOW POSTS AREA */
.posts{
  position: absolute;
  left: 22%;
  width: 55%;
}
.posts form{
  position: fixed;
  width: 48%;
  padding: 1% 5%;
  z-index: 2;
  background-color: #eee;
}
.changes{
  cursor: pointer;
}
form label {
  display: none;
}
form textarea {
  width: 100%;
  height: 60px;
  border-radius: 10px;
  border: none;
  resize: none;
}
form button {
  font-size: 600;
  padding: 5px;
  margin: 4px 0;
  background-color:white;
  border: 1px solid black;
  border-radius: 5px;
}
.posts ul {
  position: absolute;
  list-style-type: none;
  top: 120px;
  min-width: 80%;
}
.posts li{
  background: white;
  border-radius: 10px;
  margin: 15px;
  padding: 3px 10px;
}
.posts li img{
  max-width: 96%;
  margin: 3px 2%;
}
.controlPost {
  float: right;
}
.postFooter{
  display: flex;
  justify-content: space-between;
  padding: inherit;
}
.coeur{
  cursor: pointer;
}
@media(max-width: 485px) {
  .logo img {
    width: 80%;
    top: -110px;
  }
}
@media(max-width: 1000px){
  .sidebar .welcome{
    display: fixed;
    display: none;
  }
  .sidebar {
    width: 100%;
    height: 50px;
    left: 0;
    bottom: 0;
    padding: 0;
    background-color: white;
    z-index: 5;
  }
  .menu {
    padding: 0;
    margin: 0;
  }
  .menu li{
    float: left;
    margin: 0;
    padding: 0;
    width: 25%;
    height: 50px;
    line-height: 50px;
    border-radius: 0;
  }
  .menu li:hover{
    border-top: 2px solid #4E5166;
  }
  .posts{
    left: 5%;
    width: 90%;
  }
  .posts form{
    width: 80%;
    padding-left: 9%;
    z-index: 3;
  }
}

</style>
