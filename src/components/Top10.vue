<template>
  <div class="top10">
    <div>
      <h2 class="orange-text">Top 10</h2>
      <ul>
        <li v-for="(item, index) in top10Times" :key="index" class="top10-item">          
          <div class="rank"><strong>{{ index + 1 }}.</strong></div>
          <div class="user-info">
            <div><strong>{{ item.name ? item.name : "Anonymous" }}</strong></div>
            <div>[{{item.numbers.toString()}}]</div>
          </div>
          <div class="time"><strong class="orange-text">{{ item.answerTime.toFixed(1) }}s</strong></div>
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
          console.log(`${JSON.stringify(times)}`)
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
  display: flex;
  justify-content: center; /* Horizontally center the list */
}

.top10 > div {
  width: 50%; /* Occupy half the screen width */
}

ul {
  list-style: none; /* Remove bullet points */
}

.top10-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  /* border-bottom: 1px solid #ccc;  Remove the border */
}

.rank {
  width: 30px;
  text-align: center;
}

.user-info {
  flex-grow: 1; 
  text-align: left; /* Align content to the left */
  margin-left: 10px; 
}

.time {
  width: 80px;
  text-align: right;
}

.orange-text {
  color: #FF9900;
}
</style>