<template>
  <div class="top10">
    <div>
      <h2>Top 10 Fastest Times</h2>
      <ul>
        <li v-for="(item, index) in top10Times" :key="index">
          {{ index + 1 }}. {{ item.time }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { getTop10Times } from '../firebaseUtils';

export default {
  name: 'Top10',
  setup() {
    const top10Times = ref([]);

    onMounted(async () => {    
      getTop10Times()
        .then(times => {
          top10Times.value = times;
        })
        .catch(error => console.error("Error fetching top 10 times:", error));
    });

    return { top10Times };
  }
};
</script>

<style scoped>
.top10 {
    background-color: black;
    color: white;
    padding: 20px;
    position: fixed; 
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>