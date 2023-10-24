<template>
  <div class="bank-page"><Graph /><Chart /></div>
</template>

<script>
import Graph from "@/components/Graph.vue";
import Chart from "@/components/Chart.vue";
export default {
  name: "BankPage",
  components: {
    Graph,
    Chart,
  },
};
</script>

<style lang="scss">
.bank-page {
  padding: 2%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
</style>
