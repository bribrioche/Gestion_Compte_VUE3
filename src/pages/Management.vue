<template>
  <div class="management">
    <div class="alert-container">
      <div v-if="alert" class="alert">
        <v-alert
          color="success"
          icon="$success"
          :title="alertTitle"
          :text="alertMessage"
          closable
          transition="scale-transition"
        ></v-alert>
      </div>
    </div>
    <div class="lstCard">
      <div class="title"><h1>Revenus et dépenses</h1></div>
      <Card
        class="card"
        v-for="(card, index) in transactionList"
        :key="index"
        :info_item="card"
        :updateList="updateList"
      />
    </div>
    <div class="divNew">
      <div class="newItem">
        <div class="title">
          <h1>Ajouter une dépense ou un revenu</h1>
        </div>
        <v-form v-model="valid" ref="form">
          <v-container class="container">
            <v-text-field
              v-model="name"
              :counter="50"
              label="Nom"
              required
              class="input"
              :rules="nameRules"
              clearable
            ></v-text-field>

            <v-textarea
              label="Description"
              v-model="description"
              required
              class="input"
              rows="2"
            ></v-textarea>

            <div class="twoColumns">
              <v-text-field
                :rules="priceRules"
                prefix="€"
                v-model="price"
                label="Montant"
                type="number"
                class="inputLeft"
                clearable
              ></v-text-field
              ><v-select
                v-model="selectedType"
                label="Type"
                :items="itemsType"
                class="inputRight"
                :rules="typeRules"
              ></v-select>
            </div>
            <v-select
              v-if="selectedType === 'Dépense'"
              v-model="select"
              label="Catégorie"
              :items="items"
              class="input"
              :rules="categRules"
            ></v-select>

            <v-dialog
              ref="dialog"
              v-model="modal"
              persistent
              lazy
              full-width
              width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="formattedDate"
                  label="Date de l'événement"
                  prepend-icon="$calendar"
                  readonly
                  @click="modal = !modal"
                  v-on="on"
                  :rules="dateRules"
                ></v-text-field>
              </template>
              <v-date-picker
                color="#94bbe9"
                v-model="date"
                scrollable
                no-title
                inline
                :reactive="reactive"
                @click:cancel="modal = false"
                @click:save="saveDate"
              ></v-date-picker>
            </v-dialog>
            <div class="divBtnSumbit">
              <v-btn class="btnSubmit" @click="ajouterDepense" block
                >Ajouter</v-btn
              >
            </div>
          </v-container>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script>
import { VDatePicker } from "vuetify/labs/VDatePicker";
import Card from "../components/Card.vue";
import { onMounted, ref, watch } from "vue";
import Cookies from "js-cookie";

class Depense {
  constructor(name, description, category, more, price, date, idUser) {
    this.name = name;
    this.description = description;
    this.category = category;
    this.more = more;
    this.price = price;
    this.date = date;
    this.idUser = idUser;
  }
}

export default {
  name: "ManagementPage",
  components: { Card, VDatePicker },

  setup() {
    const modal = ref(false);
    const date = ref(new Date());
    const formattedDate = ref("");
    const form = ref(null);

    const saveDate = () => {
      modal.value = false;
    };

    const setDate = () => {
      formattedDate.value = date.value.toLocaleDateString("fr-FR");
    };

    watch(date, (newDate) => {
      if (newDate) {
        formattedDate.value = newDate.toLocaleDateString("fr-FR");
      } else {
        formattedDate.value = "";
      }
    });

    onMounted(setDate);

    return { modal, date, saveDate, formattedDate, form };
  },
  methods: {
    async updateList() {
      this.alert = false;
      this.alert = true;
      this.alertTitle = "Suppression !";
      this.alertMessage = "Revenu/Dépense bien supprimé(e)";
      this.resetList();
    },
    async ajouterDepense() {
      if (
        this.price != "" &&
        this.name != "" &&
        this.date != null &&
        this.date != ""
      ) {
        const name = this.name;
        const description = this.description;
        const category =
          this.selectedType === "Dépense" ? this.select : "Revenus";
        const more = this.selectedType === "Dépense" ? 0 : 1;
        const price = this.price;
        const date = this.date;
        const idUser = Cookies.get("userId");

        const nouvelleDepense = new Depense(
          name,
          description,
          category,
          more,
          price,
          date,
          idUser
        );

        try {
          const response = await fetch("http://localhost:8080/depense/create", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(nouvelleDepense),
          });

          if (response.ok) {
            this.alert = false;
            this.alert = true;
            if (this.selectedType === "Dépense") {
              this.alertMessage = "Dépense ajoutée";
            } else {
              this.alertMessage = "Revenu ajouté";
            }
            this.alertTitle = "Ajout !";

            this.resetList();
            this.resetForm();
            console.log("Dépense ajoutée avec succès !");
          } else {
            // La requête a échoué
            console.error("Échec de l'ajout de la dépense.");
          }
        } catch (error) {
          console.error("Une erreur s'est produite :", error);
        }
      }
    },
    resetForm() {
      this.form.reset();
    },
    resetList() {
      try {
        fetch(
          "http://localhost:8080/depense/getAllByUserId/" +
            Cookies.get("userId")
        )
          .then((response) => response.json())
          .then((data) => {
            this.transactionList = [];
            this.transactionList = data;

            this.transactionList.sort((b, a) => {
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              return dateA - dateB;
            });

            for (let i = 0; i < this.transactionList.length; i++) {
              const transaction = this.transactionList[i];
              const date = new Date(transaction.date);

              const jour = date.getDate();
              const mois = date.getMonth() + 1;
              const annee = date.getFullYear();

              const dateFormatee = `${jour.toString().padStart(2, "0")}/${mois
                .toString()
                .padStart(2, "0")}/${annee}`;

              this.transactionList[i].date = dateFormatee;
            }
          });
      } catch {
        console.log("error");
      }
    },
  },
  data() {
    return {
      alertTitle: "alertTitle",
      alertMessage: "alert",
      alert: false,
      nameRules: [
        (v) => !!v || "Le nom est obligatoire",
        (v) => v.length < 50 || "Le nom ne doit pas dépasser 50 caractères",
      ],
      priceRules: [
        (v) => !!v || "Le montant est obligatoire",
        (v) =>
          (!isNaN(parseFloat(v)) && parseFloat(v) >= 0) ||
          "Montant doit être un nombre positif",
      ],
      typeRules: [(v) => !!v || "Le type est obligatoire"],
      categRules: [(v) => !!v || "La catégorie est obligatoire"],
      dateRules: [(v) => !!v || "La date est obligatoire"],
      transactionList: [],
      items: [
        "Aucune",
        "Alimentaire",
        "Santé",
        "Loisirs",
        "Enfant et Scolarité",
        "Animaux",
        "Impôts et Taxes",
        "Numérique",
        "Logement / Maison",
        "Vie Quotidienne",
        "Véhicule",
        "Vacances / Weekend",
        "Autres Dépenses",
      ],
      itemsType: ["Dépense", "Revenu"],
      name: "",
      description: "",
      price: "",
      select: "Aucune",
      selectedType: "Dépense",
    };
  },

  mounted() {
    fetch(
      "http://localhost:8080/depense/getAllByUserId/" + Cookies.get("userId")
    )
      .then((response) => response.json())
      .then((data) => {
        this.transactionList = data;

        this.transactionList.sort((b, a) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          return dateA - dateB;
        });

        for (let i = 0; i < this.transactionList.length; i++) {
          const transaction = this.transactionList[i];
          const date = new Date(transaction.date);

          const jour = date.getDate();
          const mois = date.getMonth() + 1;
          const annee = date.getFullYear();

          const dateFormatee = `${jour.toString().padStart(2, "0")}/${mois
            .toString()
            .padStart(2, "0")}/${annee}`;

          this.transactionList[i].date = dateFormatee;
        }
      });
  },
};
</script>

<style lang="scss">
.management {
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  .alert-container {
    position: absolute;
    width: 100%;
    height: 100vh;
    .alert {
      position: fixed;
      width: 25%;
      bottom: 20px;
      left: 20px;
      z-index: 1000;
    }
  }

  .lstCard {
    width: 50%;
    display: flex;
    flex-direction: column;
    padding: 20px 50px;
    height: 100%;
    .card {
      margin: 5px;
      &:hover {
        cursor: pointer;
      }
    }
  }

  .divNew {
    width: 50%;
    min-height: 1px;
    position: sticky;
  }

  .newItem {
    padding: 10px 50px;
    top: 0px;
    position: sticky;
    transition: border-color 0.5s, background-color 0.5s;
  }
  .title {
    color: #132740;
    display: flex;
    justify-content: center;
  }

  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;

    .divBtnSumbit {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      width: 100%;
      padding: 10px 200px;

      .btnSubmit {
        background-color: #94bbe9;
        color: #132740;
        height: 50px;
      }
    }

    .input {
      margin: 15px 0px;
    }
    .twoColumns {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: baseline;

      .inputRight {
        padding-left: 20px;
      }
    }
  }
}
</style>
