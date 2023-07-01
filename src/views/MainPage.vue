<template lang="pug">
main.main-page
  .main-page__container
    .main-page__wrapper
      p.main-page__text
        | «Не откладывай на завтра то, что можно
        router-link.main-page__link(
          :to="{ name: 'List' }"
        ) сделать
        | сегодня»
</template>

<script>
export default {
  name: "MainPage",
}
</script>

<style lang="scss" scoped>
.main-page {
  width: 100%;
  height: 100%;
  padding: 60px 40px;
  background-color: #212832;
  &__container {
    max-width: 900px;
    height: 100%;
    margin: 0 auto;
    text-align: center;
  }
  &__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }
  &__text {
    font-weight: 700;
    font-size: 52px;
    color: #FFFFFF;
  }
  &__link {
    color: #FED36A;
    margin: 0 10px;
    text-decoration: underline solid;
  }
}
</style>