<!-- Form for creating message (block style) -->

<script>
import BlockForm from '@/components/common/BlockForm.vue';

export default {
  name: 'CreateMessageForm',
  props: ['group'],
  mixins: [BlockForm], // have template update contents
  data() {
    return {
      url: '/api/messages/' + this.group,
      method: 'POST',
      hasBody: true,
      fields: [
        {id: 'content', label: 'Create message', value: ''} // come back to figure out fields for creating a chat
      ],
      title: 'Create a message',
      refreshMessages: true,
      callback: () => {
        const message = 'Successfully created a message!';
        this.$set(this.alerts, message, 'success');
        this.$store.commit('refreshMessages', this.group);
        setTimeout(() => this.$delete(this.alerts, message), 3000);
      }
    };
  }
};
</script>
