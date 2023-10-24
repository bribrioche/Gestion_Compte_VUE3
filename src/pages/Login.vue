<template>
  <div class="login">
    <v-card class="login-card"
      ><div class="title">
        <img src="../assets/images/logo.png" alt="" class="logo" />
        <h2>Connexion</h2>
      </div>

      <v-card-text class="inputs">
        <v-text-field
          v-model="user.mail"
          label="E-mail"
          class="input"
        ></v-text-field>
        <v-text-field
          class="input"
          v-model="user.password"
          label="Mot de passe"
          type="password"
        ></v-text-field>
      </v-card-text>
      <v-card-actions class="actions">
        <v-btn @click="login" class="btnLogin">Se connecter</v-btn>
        <div class="goToSignUp" @click="signup">S'inscrire</div>
      </v-card-actions>
    </v-card>
    <div class="alert">
      <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
class Login {
  constructor(mail, password) {
    this.mail = mail;
    this.password = password;
  }
}
function caesarCipher(text, shift) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    let char = text[i];

    // Vérifier si le caractère est une lettre majuscule
    if (char.match(/[A-Z]/)) {
      const code = text.charCodeAt(i);
      // Appliquer le décalage César
      char = String.fromCharCode(((code - 65 + shift) % 26) + 65);
    }
    // Vérifier si le caractère est une lettre minuscule
    else if (char.match(/[a-z]/)) {
      const code = text.charCodeAt(i);
      // Appliquer le décalage César
      char = String.fromCharCode(((code - 97 + shift) % 26) + 97);
    }
    result += char;
  }
  return result;
}
export default {
  name: "loginPage",
  data() {
    return {
      user: {
        mail: "",
        password: "",
      },
      errorMessage: "",
    };
  },
  methods: {
    signup() {
      // console.log("inscritpion");
      this.$router.push("/signup");
    },
    async login() {
      const mail = this.user.mail;
      const password = this.user.password;

      const shift = 3; // Changer ce nombre selon votre choix
      const encryptedPassword = caesarCipher(password, shift);

      const login = new Login(mail, encryptedPassword);

      try {
        const response = await fetch("http://localhost:8080/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(login),
        });

        if (response.ok) {
          // La requête a réussi
          const data = await response.json();
          Cookies.set("token", data.token, { expires: 7 });
          Cookies.set("userId", data.user.idUser, { expires: 7 });
          this.$router.push("/");
        } else {
          // La requête a échoué
          console.error("Échec de la connexion");
          this.errorMessage = "Identifiants incorrects";
        }
      } catch (error) {
        console.error("Une erreur s'est produite :", error);
      }
    },
  },
};
</script>

<style lang="scss">
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;

  .title {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    font-size: larger;
    color: #132740;
    padding-bottom: 20px;

    .logo {
      width: 2vw;
    }
  }

  .login-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    width: 20%;
    height: 350px;
    padding: 20px;

    .inputs {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 100%;
    }
  }

  .actions {
    display: flex;
    flex-direction: column;

    .btnLogin {
      background-color: #94bbe9;
      color: #132740;
      margin-bottom: 10px;
    }

    .goToSignUp {
      font-size: small;
      color: #132740;
      text-align: center;

      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }

  .alert {
    width: 20%;
    height: 10px;
  }
}
</style>
