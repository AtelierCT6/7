<template>
<div>
  <div class="logo">
    <img src="..\assets\icon-left-font-monochrome-black.png" alt="logo">
    <button @click="signUp">Première Connexion</button>
  </div>
  <form @submit.prevent="handleSubmit">
    <label>Email:</label>
    <input type="email" required v-model="email">
    <label>Mot de Passe:</label>
    <input type="password" required v-model="password">
    <div class="submit">
      <button>Se connecter</button>
    </div>
  </form>
</div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    handleSubmit() {
      const userInfo = {
        email: this.email,
        password: this.password
      }
      this.$http.post('api/user/login', userInfo)
        .then(res => {
          if (res.status === 200) {
            localStorage.setItem('userId', res.data.userId)
            localStorage.setItem('token', res.data.token)
            this.$router.push('/home')
          }
        })
        .catch(err => {
          if (err.status === 401) {
            alert('Informations Incorrectes')
          }
        })
    },
    signUp() {
      this.$router.push('/signup')
    }
  }
}
</script>

<style scoped>
.logo {
  position: relative;
  margin: 0 auto;
  width: 485px;
  height: 150px;
  overflow: hidden;
}
img {
  position: absolute;
  width: 100%;
  left:0;
  top:-200px
}
.logo button {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: #E75480;
}
form {
  max-width: 420px;
  margin: 30px auto;
  background: white;
  text-align: left;
  padding: 40px;
  border-radius: 10px;
}
label {
  color: #aaa;
  display: inline-block;
  margin: 25px 0 15px;
  font-size: 0.6em;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: bold;
}
input {
  display: block;
  padding: 10px 6px;
  width: 100%;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px solid #ddd;
  color: #4E5166;
}
button {
  background: #4E5166;
  border: 0;
  padding: 10px 20px;
  margin: 20px;
  color: white;
  border-radius: 20px;
  cursor: pointer;
}
.submit {
  text-align: center;
}
.error {
  color: #FD2D01;
  margin-top: 10px;
  font-size: 0.8em;
  font-weight: bold;
}
</style>
