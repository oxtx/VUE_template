<template>
  <article class="account-functions">
    <flash-message v-if="success">{{ successMessage }}</flash-message>
    <div class="account-functions__search">
      <h2 class="account-functions__search-header">Search for User Email</h2>
      <form
        class="account-functions__search-form"
        @submit.prevent="searchForAlias"
      >
        <form-input
          labelText="Alias ID of the user"
          name="alias"
          placeholder="Alias ID"
          v-model="localAliasId"
          :class="{ searchError }"
          @input="clearSearchError"
        />
        <div class="account-functions__search-result" v-if="searchEmail">
          {{ searchEmail }}
        </div>
        <div class="error__message" v-if="searchError">{{ searchError }}</div>
        <form-button type="submit" text="Search for user" :disabled="success" />
      </form>
    </div>
    <div class="account-functions__suspend">
      <h2 class="account-functions__suspend-header">Suspend User Account</h2>
      <form
        class="account-functions__suspend-form"
        @submit.prevent="suspendUser"
      >
        <form-input
          labelText="Email of the user"
          name="email"
          placeholder="Email"
          v-model="suspendEmail"
          :class="{ suspendError }"
          @input="clearSuspendError"
        />
        <form-input
          labelText="Reason for suspension"
          name="reason"
          placeholder="Reason for suspension"
          v-model="suspendReason"
          :class="{ error }"
          @input="clearSuspendError"
        />
        <div class="error__message" v-if="error">{{ suspendError }}</div>
        <form-button type="submit" text="Suspend user" :disabled="success" />
      </form>
    </div>
  </article>
</template>

<script>
import { findEmail, adminSuspend } from '@/services/auth.service';
import FormButton from '~common/Buttons/FormButton';
import FormInput from '~common/Fields/FormInput';
import formMessagesMixin from '@/mixins/form-messages.mixin';

export default {
  props: {
    aliasId: {
      type: String
    }
  },
  components: {
    FormButton,
    FormInput
  },
  mixins: [formMessagesMixin],
  data() {
    return {
      error: null,
      searchError: null,
      suspendError: null,
      searchEmail: null,
      suspendEmail: '',
      suspendReason: '',
      localAliasId: this.aliasId
    };
  },
  methods: {
    async getData() {
      this.localAliasId = this.aliasId;
    },
    clearSearchError() {
      this.searchError = null;
    },
    clearSuspendError() {
      this.suspendError = null;
    },
    async searchForAlias() {
      findEmail({
        aliasId: this.localAliasId
      }).then(email => {
        this.searchEmail = email;
        this.localAliasId = '';
      });
    },
    async suspendUser() {
      await adminSuspend({
        email: this.suspendEmail.trim().toLowerCase(),
        reason: this.suspendReason.trim().toLowerCase()
      }).then(() => {
        this.suspendEmail = '';
        this.suspendReason = '';
        this.showSuccess();
      });
    }
  },
  async mounted() {
    await this.getData();
  }
};
</script>

<style lang="scss" scoped>
.account-functions {
  overflow-y: auto;
  margin-top: var(--element-margin-m);

  &__search {
    border: var(--border-width-default) solid var(--border-block);
    background-color: var(--BG-blog-post);
    padding: var(--element-padding-s);
    border-radius: var(--border-radius);

    &-header {
      color: var(--text-primary);
      text-align: center;
    }

    &-form {
      margin: 0 auto;
      max-width: var(--width-large);
    }

    &-result {
      color: var(--text-primary);
      margin: 0 auto;
      max-width: var(--width-large);

      margin-bottom: var(--element-margin-s);
    }

    ::v-deep {
      input {
        border: var(--border-width-default) solid;
        border-color: var(--border-input-normal);
        margin-bottom: var(--element-margin-s);
      }
    }
  }

  &__suspend {
    border: var(--border-width-default) solid var(--border-block);
    background-color: var(--BG-blog-post);
    padding: var(--element-padding-s);
    border-radius: var(--border-radius);
    margin-top: var(--element-margin-m);

    &-header {
      color: var(--text-primary);
      text-align: center;
    }
    &-form {
      margin: 0 auto;
      max-width: var(--width-large);
    }
    ::v-deep {
      input {
        border: var(--border-width-default) solid;
        border-color: var(--border-input-normal);
        margin-bottom: var(--element-margin-s);
      }
    }
  }
}

.error__message {
  font-size: var(--size-small);
  color: var(--error);
  margin-bottom: var(--element-margin-m);
  &:first-letter {
    text-transform: uppercase;
  }
}

::v-deep .error {
  margin-bottom: var(--element-margin-xs);
  input,
  textarea {
    border-color: var(--border-input-error);
  }
}
</style>
