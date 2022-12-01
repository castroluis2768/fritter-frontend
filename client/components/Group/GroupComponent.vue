<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
  <section>
    <div class="group">
      <router-link :to="{ name: 'Messages', params: { group: group._id }}">
        <h3 class="name">
          {{ group.name }}
        </h3>
      </router-link>
    </div>
    <button @click="deleteGroup">
      🗑️ Delete
    </button>
  </section>
</template>

<script>
export default {
  name: 'GroupComponent',
  props: {
    // Data from the stored freet
    group: {
      type: Object,
      required: true
    }
  },
  methods: {
    deleteGroup() {
      const params = {
        method: 'DELETE',
        callback: () => {
          this.$store.commit('alert', {
            message: 'Successfully deleted group!', status: 'success'
          });
        }
      };
      this.request(params);
    },
    async request(params) {
      /**
       * Submits a request to the freet's endpoint
       * @param params - Options for the request
       * @param params.body - Body for the request, if it exists
       * @param params.callback - Function to run if the the request succeeds
       */
      const options = {
        method: params.method, headers: {'Content-Type': 'application/json'}
      };
      if (params.body) {
        options.body = params.body;
      }

      try {
        const r = await fetch(`/api/groups/${this.group._id}`, options);
        if (!r.ok) {
          const res = await r.json();
          throw new Error(res.error);
        }

        this.$store.commit('refreshGroups');

        params.callback();
      } catch (e) {
        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
    }
  }
};
</script>

<style scoped>

</style>
