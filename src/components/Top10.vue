<template>
  <div class="top10">
    <h2 class="orange-text top10-title">Top 10</h2> 
    <div class="scrollable-content">
        <ul>
          <li v-for="(item, index) in top10Times" :key="index" class="top10-item">          
            <div class="rank"><strong>{{ index + 1 }}.</strong></div>
            <div class="user-info">
              <div><strong>{{ item.name ? item.name : "Anonymous" }}</strong></div>
              <div>[{{item.numbers.toString()}}]</div>
            </div>
            <div class="time"><strong class="orange-text">{{ Math.floor(item.answerTime) }}</strong><span class="time-unit">s</span></div>
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
    height: 80vh; 
    display: flex;
    flex-direction: column;
    align-items: center; /* Center items horizontally within the container */
}
.top10 > *{
  width: 100%; /* Make ul and title take up 80% of the screen width */
}
.top10-title {
    padding: 20px; 
    width: 100%; /* Make title take full width for centering */
    text-align: center; /* Center the title */
}

.scrollable-content {
    flex-grow: 1; /* Allow content to take up remaining space */
    overflow-y: auto; /* Enable scrolling for the content */
    padding: 0; /* Remove padding to the sides */
    width: 100%;  
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
  width: 100%;
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
  width: auto; /* Allow the width to adjust to content */
  text-align: left; /* Changed to left align */
  white-space: nowrap; /* Prevent the "s" from wrapping */
}

.time-unit {
  display: inline-block; /* Ensure the "s" takes up space */
}


.orange-text {
  color: #FF9900;
}
</style>