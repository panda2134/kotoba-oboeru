<template>
  <v-app :dark="isDark">
    <v-app-bar
      fixed
      app
    >
      <v-toolbar-title v-text="title" />
      <v-spacer />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      title: '日语背单词'
    }
  },
  computed: {
    isDark () {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  },
  beforeMount () {
    this.$vuetify.theme.dark = this.isDark
  }
}
</script>
