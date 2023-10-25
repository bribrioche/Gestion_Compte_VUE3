<template>
  <div class="card">
    <v-tooltip
      location="right"
      :text="
        info_item.description ? info_item.description : 'Pas de description'
      "
    >
      <template v-slot:activator="{ props }">
        <v-dialog v-model="dialog" persistent width="auto">
          <v-card>
            <v-card-title class="text-h5"> Supprimer ? </v-card-title>
            <v-card-text v-if="info_item.more"
              >Souhaitez-vous supprimer ce revenu ?</v-card-text
            >
            <v-card-text v-if="!info_item.more"
              >Souhaitez-vous supprimer cette dépense ?</v-card-text
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="btnDialogNo" variant="text" @click="dialog = false">
                Retour
              </v-btn>
              <v-btn
                class="btnDialogOk"
                background-color="#94bbe9"
                variant="text"
                @click="deleteThis"
              >
                Confirmer
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-card class="cardItem" v-bind="props"
          ><v-btn class="btnDelete" @click="openConfirm"
            ><v-icon icon="$delete"></v-icon
          ></v-btn>
          <div class="infos">
            <div class="date">
              <p>{{ info_item.date }}</p>
            </div>
            <div class="desc">
              <p>{{ info_item.name }}</p>
            </div>
            <div class="price">
              <h4 class="more" v-if="info_item.more">
                + {{ info_item.price }} €
              </h4>
              <h4 class="less" v-if="!info_item.more">
                - {{ info_item.price }} €
              </h4>
            </div>
          </div>
        </v-card>
      </template>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: "CardComponent",
  props: {
    info_item: Object,
    updateList: Function,
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    openConfirm() {
      this.dialog = true;
    },
    async deleteThis() {
      this.dialog = false;
      try {
        const response = await fetch(
          "http://localhost:8080/depense/delete/" + this.info_item.id,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          this.updateList();
        } else {
          console.error("Échec de la suppression");
        }
      } catch (error) {
        console.error("Une erreur s'est produite :", error);
      }
    },
  },
};
</script>

<style lang="scss">
.btnDialogOk {
  background-color: #94bbe9;
  color: #132740;
}

.btnDialogNo {
  color: #94bbe9;
  background-color: #132740;
}

.card {
  .cardItem {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .btnDelete {
      background-color: rgb(197, 0, 0);
      color: white;
      width: 35px;
      min-width: 35px !important;
      margin: 20px;
    }

    .infos {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding-left: 10px;
      padding-right: 50px;
    }

    .desc {
      display: flex;
      flex-wrap: wrap;
    }

    .price {
      display: flex;
      justify-content: end;
      color: green;
    }
  }

  .more {
    color: green;
  }

  .less {
    color: rgb(197, 0, 0);
  }
}
</style>
