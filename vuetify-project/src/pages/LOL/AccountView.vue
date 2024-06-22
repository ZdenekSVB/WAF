<template>
    <div>
      <h1>Account View</h1>
      <div v-if="userData">
        <pre>{{ userData }}</pre>
      </div>
    </div>
  </template>
  
  <script>
  import { useLolStore } from '@/stores/lolStore';
  import { computed } from 'vue';
  
  export default {
    name: 'AccountView',
    props: ['game'],
    setup() {
      const lolStore = useLolStore();
      const userData = computed(() => {
        return lolStore.getUserData;
      });
  
      return {
        userData
      };
    }
  };
  </script>
  
  <style scoped>

  </style>
  