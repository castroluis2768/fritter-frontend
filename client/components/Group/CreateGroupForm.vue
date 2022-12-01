<!-- Form for creating group (block style) -->



<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateGroupForm',
  mixins: [BlockForm], // have template update contents
  data() {
    return {
      url: '/api/groups',
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Name of conversation', value: ''} // come back to figure out fields for creating a chat
      ],
      title: 'Start conversation',
      refreshGroups: true,
      callback: () => {
        const message = 'Successfully started a chat!';
        this.$set(this.alerts, message, 'success');
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  },
  mounted() {
    this.$store.commit('resetTemplate');
  }
};
</script>
