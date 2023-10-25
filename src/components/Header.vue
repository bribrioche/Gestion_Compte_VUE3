<template>
  <div class="header">
    <router-link to="/"
      ><div class="logo"><img src="../assets/images/logo.png" alt="" /></div
    ></router-link>

    <div class="navigation">
      <v-dialog v-model="dialog" persistent width="auto">
        <v-card>
          <v-card-title class="text-h5"> Deconnexion</v-card-title>

          <v-card-text>Souhaitez-vous vous déconnecter ?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="outlined"
              class="btnDialogNo"
              color="#132740"
              @click="dialog = false"
            >
              Retour
            </v-btn>
            <v-btn
              color="#132740"
              class="btnDialogOk"
              background-color="#94bbe9"
              variant="text"
              @click="logout"
            >
              Confirmer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <div class="leftNav">
        <v-btn
          v-bind="props"
          prepend-icon="$home"
          variant="text"
          rounded="xs"
          class="btnText"
          @click="goToHome"
        >
          Accueil</v-btn
        >
        <div class="text-align">
          <v-menu open-on-hover>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                prepend-icon="$euro"
                variant="text"
                rounded="xs"
                class="btnText"
                >Mon compte bancaire &nbsp;
                <v-icon icon="$triangleDown"></v-icon
              ></v-btn>
            </template>

            <v-list>
              <v-list-item>
                <v-btn
                  prepend-icon="$chart"
                  variant="text"
                  rounded="xs"
                  @click="goToBankaccount"
                  >Voir mon compte</v-btn
                ></v-list-item
              >
              <v-list-item
                ><v-btn
                  prepend-icon="$plus"
                  variant="text"
                  rounded="xs"
                  @click="goToManagement"
                  >Ajouter une entrée/sortie d'argent
                </v-btn></v-list-item
              >
            </v-list>
          </v-menu>
        </div>
      </div>

      <v-btn
        prepend-icon="$account"
        variant="outlined"
        rounded="xl"
        class="btnText"
        @click="openConfirm"
        >Logout</v-btn
      >
    </div>
  </div>
</template>

<script>
// import { ref } from "vue";
import Cookies from "js-cookie";
export default {
  name: "HeaderBanner",
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    goToHome() {
      this.$router.push("/");
    },
    goToManagement() {
      this.$router.push("/management");
    },
    goToBankaccount() {
      this.$router.push("/bankaccount");
    },
    openConfirm() {
      this.dialog = true;
    },
    logout() {
      Cookies.remove("token");
      Cookies.remove("userId");
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss">
.header {
  background: #94bbe9;
  min-height: 80px;
  max-height: 80px;
  width: 100%;
  display: flex;
  align-items: center;

  padding-left: 15px;

  .logo {
    img {
      width: 50px;
      height: 50px;
    }
  }
  .navigation {
    padding: 0 30px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .leftNav {
      display: flex;
      flex-direction: row;
    }

    a {
      text-decoration: none;
      color: #ffffff;
      font-family: "Roboto", sans-serif;
      display: flex;
      align-items: center;
    }
  }

  .btnText {
    color: #132740;
  }
}
</style>
