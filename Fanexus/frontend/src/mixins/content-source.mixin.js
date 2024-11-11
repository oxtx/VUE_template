import { mapState, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapState({
      activeAliasId: state => state.alias.activeAliasId,
      isAuthenticated: state => state.auth.isAuthenticated,
      isModerator: state =>
        state.auth.userData && state.auth.userData.moderator,
      data: state => state.feed.data
    }),
    ...mapGetters(['activeAlias']),
    additionalOptions() {
      return this.isAuthenticated
        ? this.isModerator
          ? [
              {
                text: 'Suspend user',
                action: 'suspend',
                special: true,
                toggleable: false
              },
              {
                text: this.data.aliasBlocking ? 'Unblock' : 'Block',
                action: this.data.aliasBlocking ? 'unblock' : 'block',
                special: true,
                toggleable: false
              }
            ]
          : [
              {
                text: this.data.aliasBlocking ? 'Unblock' : 'Block',
                action: this.data.aliasBlocking ? 'unblock' : 'block',
                special: true,
                toggleable: false
              }
            ]
        : undefined;
    }
  }
};
