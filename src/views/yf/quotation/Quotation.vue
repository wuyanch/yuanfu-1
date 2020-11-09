<template>
  <div>
    <a-back-top />
    <search-form></search-form>
    <personal></personal>
  </div>
</template>

<script>
import SearchForm from './SearchForm'
import Personal from './Personal'

export default {
  name: 'Quotation',
  components:{
    SearchForm,
    Personal,
  },
  data() {
    return {}
  },
}
</script>

<style scoped>
</style>