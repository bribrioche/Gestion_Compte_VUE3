<template>
  <div class="graph">
    <v-chart class="chart" :option="option" autoresize />
  </div>
</template>

<script>
export default {
  name: "graphVue",
};
</script>
<script setup>
import { onMounted, ref } from "vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { provide } from "vue";
import Cookies from "js-cookie";

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);
provide(THEME_KEY, "light");
const labels = ref([]); // Initialisation de labels vide

const option = ref({
  title: {
    text: "Catégories de dépenses sur les 30 derniers jours",
    left: "center",
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/>{b} : {c} ({d}%)",
  },
  legend: {
    orient: "vertical",
    bottom: "bottom",
    data: [],
  },
  series: [
    {
      name: "Catégorie",
      type: "pie",
      radius: "60%",
      center: ["50%", "50%"],
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
});

const Depenses = ref([]);

const retrieveData = () => {
  fetch("http://localhost:8080/depense/getAllByUserId/" + Cookies.get("userId"))
    .then((response) => {
      if (!response.ok) {
        throw new Error("Réponse du serveur invalide");
      }
      return response.json();
    })
    .then((data) => {
      Depenses.value = data;

      const categories = {};

      Depenses.value.forEach((depense) => {
        if (!depense.more) {
          const category = depense.category;
          if (!categories[category]) {
            categories[category] = 0;
          }
          categories[category] += 1;
        }
      });

      labels.value = Object.keys(categories);

      option.value.series[0].data = labels.value.map((category) => ({
        value: categories[category],
        name: category,
      }));
      option.value.legend.data = labels.value;
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération des données:", error);
    });
};

onMounted(() => {
  retrieveData();
});
</script>

<style scoped>
.chart {
  height: 80vh;
  width: 80vh;
}
</style>
