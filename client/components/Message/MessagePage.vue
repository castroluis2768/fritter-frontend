<!-- Default page that also displays freets -->

<template>
  <main>
    <section>
      <header>
        <h2>Messages Page</h2>
      </header>
      <CreateMessageForm :group="this.$route.params.group" />
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing all messages
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <GetMessageForm
            ref="getMessageForm"
            value="author"
            placeholder="🔍 Filter by member (optional)"
            button="🔄 Get messages"
          />
        </div>
      </header>
      <section
        v-if="this.$store.state.messages.length"
      >
        <MessageComponent
          v-for="message in this.$store.state.messages"
          :key="message.id"
          :message="message"
        />
      </section>
      <article
        v-else
      >
        <h3>No messages found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import MessageComponent from '@/components/Message/MessageComponent.vue';
import GetMessageForm from '@/components/Message/GetMessageForm.vue';
import CreateMessageForm from '@/components/Message/CreateMessageForm.vue';

export default {
  name: 'MessagePage',
  props: {
    group: String
  },
  components: {MessageComponent, GetMessageForm, CreateMessageForm},
  async mounted() {
    const url = `/api/groups/` + this.$route.params.group;
      console.log(url);
      try {
        const r = await fetch(url);
        const res = await r.json();
        if (!r.ok) {
          throw new Error(res.error);
        }

        this.$store.commit('updateMessages', res.allMessages);
      } catch (e) {
        if (this.value === this.$store.state.filter) {
          // This section triggers if you filter to a user but they
          // change their username when you refresh
          this.$store.commit('updateFilter', null);
          this.value = ''; // Clear filter to show all users' freets
          this.$store.commit('refreshGroups');
        } else {
          // Otherwise reset to previous fitler
          this.value = this.$store.state.filter;
        }

        this.$set(this.alerts, e, 'error');
        setTimeout(() => this.$delete(this.alerts, e), 3000);
      }
  }
};
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

header, header > * {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

button {
    margin-right: 10px;
}

section .scrollbox {
  flex: 1 0 50vh;
  padding: 3%;
  overflow-y: scroll;
}
</style>
