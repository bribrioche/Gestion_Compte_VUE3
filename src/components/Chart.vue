<template>
  <div class="graph">
    <v-chart class="chart" :option="option" autoresize />
  </div>
</template>

<script>
export default {
  name: "chartVue",
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

const last30Days = [];
const options = { day: "2-digit", month: "short" };

for (let i = 29; i >= 0; i--) {
  const date = new Date();
  date.setDate(date.getDate() - i);
  const formattedDate = date.toLocaleString("default", options);
  last30Days.push(formattedDate);
}

const option = ref({
  title: {
    text: "Dépenses sur les 30 derniers jours",
  },
  tooltip: {
    trigger: "axis",
  },
  legend: {
    top: "50px",
    data: ["Solde", "Revenus", "Dépenses"],
  },
  grid: {
    top: "100px",
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: "category",
    data: last30Days,
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      name: "Solde",
      type: "line",
      step: "start",
      data: [],
    },
    {
      name: "Revenus",
      type: "line",
      step: "start",
      data: [],
    },
    {
      name: "Dépenses",
      type: "line",
      step: "start",
      data: [],
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
      const currentDate = new Date();

      const positiveData = Array(30).fill(0);
      const negativeData = Array(30).fill(0);

      let startMoney = 0;

      Depenses.value.forEach((depense) => {
        const date = new Date(depense.date);
        const diffDays = Math.floor(
          (currentDate - date) / (1000 * 60 * 60 * 24)
        );

        if (diffDays >= 30) {
          if (depense.more) {
            startMoney += depense.price;
          } else {
            startMoney -= depense.price;
          }
        } else if (diffDays >= 0 && diffDays < 30) {
          if (depense.more) {
            positiveData[29 - diffDays] += depense.price;
          } else {
            negativeData[29 - diffDays] += depense.price;
          }
        }
      });

      const dailyMoney = [startMoney];
      const totalExpenses = [0];
      const totalIncome = [0];

      for (let index = 1; index < 30; index++) {
        const previousMoney = dailyMoney[index - 1];
        const dailyIncome = positiveData[index - 1];
        const dailyExpense = negativeData[index - 1];

        const newMoney =
          Math.ceil((previousMoney + dailyIncome - dailyExpense) * 100) / 100;
        dailyMoney[index] = newMoney;

        totalIncome[index] = totalIncome[index - 1] + dailyIncome;
        totalExpenses[index] = totalExpenses[index - 1] + dailyExpense;
      }

      console.log(dailyMoney);
      console.log(totalIncome);
      console.log(totalExpenses);

      option.value.series[0].data = dailyMoney;
      option.value.series[1].data = totalIncome;
      option.value.series[2].data = totalExpenses;
    });
};

onMounted(() => {
  retrieveData();
});
</script>

<style scoped>
.chart {
  height: 70vh;
  width: 70vh;
}
</style>
