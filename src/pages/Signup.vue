<template>
  <div class="signup">
    <div class="alert-container">
      <div v-if="alert" class="alert">
        <v-alert
          color="warning"
          icon="$warning"
          title="Attention"
          :text="alertMessage"
          closable
          transition="scale-transition"
        ></v-alert>
      </div>
    </div>
    <v-container class="container">
      <v-card class="card">
        <div class="title">
          <img src="../assets/images/logo.png" alt="" class="logo" />
          <h2>Inscription</h2>
        </div>
        <v-form @submit.prevent="register">
          <v-text-field
            v-model="name"
            :rules="rules.nameRules"
            label="Nom"
            @input="validateName"
            ref="name"
          ></v-text-field>

          <v-text-field
            v-model="surname"
            :rules="rules.surnameRules"
            label="Prénom"
            @input="validateSurname"
            ref="surname"
          ></v-text-field>

          <v-text-field
            v-model="email"
            :rules="rules.emailRules"
            label="E-mail"
            @input="validateEmail"
            ref="email"
          ></v-text-field>

          <v-text-field
            v-model="password"
            :rules="rules.passwordRules"
            label="Mot de passe"
            type="password"
            @input="validatePassword"
            ref="password"
          ></v-text-field>

          <v-text-field
            v-model="confirmPassword"
            :rules="rules.confirmPasswordRules"
            label="Confirmation du mot de passe"
            type="password"
            @input="validateConfirmPassword"
            ref="confirmPassword"
          ></v-text-field>
          <div class="buttons">
            <v-btn type="submit" :disabled="!isFormValid">Inscription</v-btn>
            <div class="goToLogin" @click="login">Déjà inscrit ?</div>
          </div>
        </v-form></v-card
      >
    </v-container>
  </div>
</template>

<script>
class User {
  constructor(firstName, lastName, mail, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.mail = mail;
    this.password = password;
  }
}

export default {
  name: "signupPage",
  data() {
    return {
      alertMessage: "alert",
      alert: false,
      name: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
      isNameValid: false,
      isSurnameValid: false,
      isEmailValid: false,
      isPasswordValid: false,
      isConfirmPasswordValid: false,
      rules: {
        nameRules: [(v) => !!v || "Le nom est obligatoire"],
        surnameRules: [(v) => !!v || "Le prénom est obligatoire"],
        emailRules: [
          (v) => !!v || "L'adresse e-mail est requise",
          (v) => /.+@.+\..+/.test(v) || "L'adresse e-mail doit être valide",
        ],
        passwordRules: [
          (v) => !!v || "Le mot de passe est requis",
          (v) =>
            (v && v.length >= 8) ||
            "Le mot de passe doit comporter au moins 8 caractères",
          (v) =>
            (v.match(/[!@#$%^&*]/g) || []).length >= 2 ||
            "Le mot de passe doit comporter au moins 2 caractères spéciaux",
        ],
        confirmPasswordRules: [
          (v) => !!v || "Confirmation du mot de passe requise",
          (v) =>
            v === this.password || "Les mots de passe ne correspondent pas",
        ],
      },
    };
  },
  computed: {
    isFormValid() {
      // Vérifie la validité de chaque champ
      const isNameValid = this.rules.nameRules.every(
        (rule) => rule(this.name) === true
      );
      const isSurnameValid = this.rules.surnameRules.every(
        (rule) => rule(this.surname) === true
      );
      const isEmailValid = this.rules.emailRules.every(
        (rule) => rule(this.email) === true
      );
      const isPasswordValid = this.rules.passwordRules.every(
        (rule) => rule(this.password) === true
      );
      const isConfirmPasswordValid = this.rules.confirmPasswordRules.every(
        (rule) => rule(this.confirmPassword) === true
      );

      console.log(isPasswordValid);
      // Renvoie true si tous les champs sont valides
      return (
        isNameValid &&
        isSurnameValid &&
        isEmailValid &&
        isPasswordValid &&
        isConfirmPasswordValid
      );
    },
  },
  methods: {
    validateName() {
      this.isNameValid = this.$refs.name.validate();
    },
    validateSurname() {
      this.isSurnameValid = this.$refs.surname.validate();
    },
    validateEmail() {
      this.isEmailValid = this.$refs.email.validate();
    },
    validatePassword() {
      this.isPasswordValid = this.$refs.password.validate();
    },
    validateConfirmPassword() {
      this.isConfirmPasswordValid = this.$refs.confirmPassword.validate();
    },
    login() {
      // console.log("inscritpion");
      this.$router.push("/login");
    },
    async register() {
      // Inscription de l'utilisateur lorsque tous les champs sont valides
      if (this.isFormValid) {
        const user = new User(
          this.surname,
          this.name,
          this.email,
          this.password
        );
        if (this.password === this.confirmPassword) {
          try {
            const response = await fetch(
              "http://localhost:8080/user/getByMail",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(this.email),
              }
            );

            if (response.ok) {
              // La requête a réussi
              const data = await response.json();
              if (data === false) {
                try {
                  const response = await fetch(
                    "http://localhost:8080/user/create",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(user),
                    }
                  );

                  if (response.ok) {
                    this.$router.push("/login");
                  } else {
                    // La requête a échoué
                    console.error("Échec de l'inscription");
                    this.errorMessage = "Échec de l'inscription";
                  }
                } catch (error) {
                  console.error("Une erreur s'est produite :", error);
                }
              } else {
                console.log("mail pas ok");
                this.alert = true;
                this.alertMessage = "Cette adresse mail est déjà enregistrée";
              }
            } else {
              // La requête a échoué
              console.error("Échec de la connexion");
            }
          } catch (error) {
            console.error("Une erreur s'est produite :", error);
          }
        } else {
          // Les mots de passe ne correspondent pas
          console.log("Les mots de passe ne correspondent pas.");
        }
      } else {
        console.log(
          "Le formulaire n'est pas valide. Veuillez corriger les erreurs."
        );
      }
    },
  },
};
</script>

<style lang="scss">
.signup {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;

  .alert-container {
    position: absolute;
    width: 100%;
    height: 100vh;
    .alert {
      position: absolute;
      width: 25%;
      top: 20px;
      right: 20px;
      z-index: 1000;
    }
  }

  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;

    .title {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      font-size: larger;
      color: #132740;
      padding-bottom: 20px;

      .logo {
        width: 2vw;
        margin-right: 20px;
      }
    }
    .card {
      width: 70%;
      padding: 30px 30px;

      .buttons {
        display: flex;
        flex-direction: column;
        align-items: center;

        .goToLogin {
          padding-top: 10px;
          font-size: small;
          color: #132740;
          text-align: center;

          &:hover {
            cursor: pointer;
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
