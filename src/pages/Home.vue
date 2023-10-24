<template>
  <div class="home">
    <v-card class="cardAccount">
      <div class="account">
        <img src="../assets/images/bankCard.png" alt="" class="bankCard" />
      </div>
      <div class="infos">
        <h1>Mon compte bancaire</h1>
        <p>{{ user.firstName }} {{ user.lastName }}</p>
        <div class="solde">
          <p>Compte courant :</p>
          <h4 class="more" v-if="total >= 0">{{ total }}€</h4>
          <h4 class="less" v-if="total < 0">{{ total }}€</h4>
        </div>
      </div>
      <div class="buttons">
        <v-btn variant="flat" color="grey-lighten-4" prepend-icon="$eye"
          >Voir mon profil</v-btn
        >
      </div>
    </v-card>

    <router-link to="/bankaccount" class="card">
      <v-card>
        <div class="img-wrapper">
          <img src="../assets/images/Graph.png" class="image" />
        </div>
        <v-card-actions>
          <v-btn variant="text" prepend-icon="$chart" class="txtBtn"
            >Voir mon compte</v-btn
          >
        </v-card-actions>
      </v-card>
    </router-link>

    <router-link to="/management" class="card">
      <v-card
        ><div class="img-wrapper">
          <img src="../assets/images/Depenses2.png" class="image" />
        </div>
        <v-card-actions>
          <v-btn variant="text" prepend-icon="$plus"
            >Ajouter une entrée/sortie d'argent</v-btn
          >
        </v-card-actions>
      </v-card></router-link
    >
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { ref, onMounted } from "vue";

export default {
  name: "HomePage",
  setup() {
    class User {
      constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
      }
    }

    const user = ref(new User("", ""));
    const total = ref(0);

    const currentUser = () => {
      fetch("http://localhost:8080/user/get/" + Cookies.get("userId"))
        .then((response) => {
          if (!response.ok) {
            throw new Error("Réponse du serveur invalide");
          }
          return response.json();
        })
        .then((data) => {
          user.value.firstName = data.firstName;
          user.value.lastName = data.lastName;
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des données:", error);
        });
    };

    const fetchExpenses = () => {
      fetch(
        "http://localhost:8080/depense/getAllByUserId/" + Cookies.get("userId")
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Réponse du serveur invalide");
          }
          return response.json();
        })
        .then((data) => {
          for (let index = 0; index < data.length; index++) {
            if (data[index].more === false) {
              total.value = (
                Math.ceil(total.value * 100) / 100 -
                Math.ceil(data[index].price * 100) / 100
              ).toFixed(2);
            } else {
              total.value = (
                Math.ceil(total.value * 100) / 100 +
                Math.ceil(data[index].price * 100) / 100
              ).toFixed(2);
            }
          }
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des dépenses:", error);
        });
    };

    onMounted(() => {
      currentUser();
      fetchExpenses(); // Appeler la méthode pour récupérer les dépenses
    });

    return {
      user,
      total, // Renvoie la variable total
    };
  },
};
</script>

<style lang="scss">
.home {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;

  .cardAccount {
    padding: 0 50px;
    width: 80%;
    height: 250px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 70px;

    .infos {
      height: auto;
      flex: 1;
      padding-left: 50px;
      padding-top: 20px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      align-self: flex-start;

      p {
        padding: 10px;
      }
    }

    .buttons {
      padding-top: 40px;
      width: auto;
      align-self: flex-start;
    }
  }
  .txtBtn {
    text-decoration: transparent;
  }
  .bankCard {
    width: 250px;
  }

  .card {
    margin: 0 35px;
    width: 30%;
    text-decoration: none;
    &:hover {
      cursor: pointer;
    }
  }
}
.img-wrapper {
  padding-top: 20px;
  display: flex;
  justify-content: center;
  .image {
    height: 200px;
  }
}

.imageAccount {
  height: 300px;
}

.solde {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.more {
  color: green;
}

.less {
  color: rgb(197, 0, 0);
}
</style>
