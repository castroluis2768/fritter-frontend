<!-- Default page that also displays freets -->

<template>
  <main>
    <section>
      <header>
        <h2>Chats Page</h2>
      </header>
      <CreateGroupForm />
    </section>
    <section>
      <header>
        <div class="left">
          <h2>
            Viewing all chats
            <span v-if="$store.state.filter">
              by @{{ $store.state.filter }}
            </span>
          </h2>
        </div>
        <div class="right">
          <GetGroupForm
            ref="getGroupForm"
            value="author"
            placeholder="🔍 Filter by member (optional)"
            button="🔄 Get chats"
          />
        </div>
      </header>
      <section
        v-if="$store.state.groups.length"
      >
        <GroupComponent
          v-for="group in $store.state.groups"
          :key="group.id"
          :group="group"
        />
      </section>
      <article
        v-else
      >
        <h3>No chats found.</h3>
      </article>
    </section>
  </main>
</template>

<script>
import GroupComponent from '@/components/Group/GroupComponent.vue';
import GetGroupForm from '@/components/Group/GetGroupForm.vue';
import CreateGroupForm from '@/components/Group/CreateGroupForm.vue';

export default {
  name: 'GroupPage',
  components: {GroupComponent, GetGroupForm, CreateGroupForm},
  mounted() {
    this.$refs.getGroupForm.submit();
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
