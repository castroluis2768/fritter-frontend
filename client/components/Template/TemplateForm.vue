<template>
  <section id="dropdown">
      <dropdown :options="$store.state.templates" :selected="$store.state.selectTemplate"
        :placeholder="'Select a Template'" :close-on-outside-click="boolean" @updateOption="pickOutTemplate" />
  </section>
</template>


<script>
import dropdown from 'vue-dropdowns';

export default {
  name: 'TemplateForm',
  components: {
    'dropdown': dropdown,
  },
  data() {
    return {
      object: {
        name: "Select a template."
      },
    }
  },
  mounted() {
    this.getTemplates()
  },
  methods: {
    pickOutTemplate(payload) {
            this.$store.commit('updateSelectedTemplate', payload);
            this.getTemplates();
          },
    async getTemplates() {
      const url = `/api/templates`;
      try {
        const r = await fetch(url);
        const res = await r.json();
          if (res) {
            const elements = []
            for (const element of res) {
              elements.push({ name: element.content })
            }
            this.$store.commit('updateTemplates', elements);
          }
      } catch (e) {
        console.warn(e)
      }
    }
  }
};
</script>
