<template>
  <div class="card">
    <v-tooltip
      location="right"
      :text="
        info_item.description ? info_item.description : 'Pas de description'
      "
    >
      <template v-slot:activator="{ props }">
        <v-card class="cardItem" v-bind="props"
          ><div class="infos">
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
  },
};
</script>

<style lang="scss">
.card {
  .cardItem {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .infos {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding-left: 50px;
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
