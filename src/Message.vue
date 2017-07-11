<template lang="html">
  <div class="message" :class="{'message--owned': message.user.id === user.id}">
    <div class="message__body">
      <div class="message__user"><span :style="{color: stringToColor(message.user.id)}">{{message.user.name}}</span></div>
      <span class="message__details-toggle"></span>
      <div class="message__content" v-html="message.content"></div>
      <div class="message__time">{{getTime(message.datetime)}}</div>
    </div>
  </div>
</template>

<script>
import stringToColor from './stringToColor';

export default {
  props: {
    message: {
      type: Object,
    },
  },
  data() {
    return this.$store.state;
  },
  methods: {
    stringToColor,
    getTime(date) {
      const time = new Date(date);

      return `${time.getHours()}:${(time.getMinutes() < 10 ? '0' : '') + time.getMinutes()}`;
    }
  },
};
</script>

<style lang="scss">
.message {
  display: flex;

  &--owned {
    flex-direction: row-reverse;
  }
}

.message__body {
  position: relative;
  z-index: 1;
  background: #fafafa;
  padding: 10px;
  border-radius: 7px;
  margin-bottom: 10px;
  display: inline-flex;
  flex-direction: column;
  flex: 0 0 auto;
  flex-shrink: 1;
  cursor: pointer;

  .message--owned & {
    background: #edfaf6;
  }
}

.message__user {
  font-weight: 800;
  color: #35cd96;
  line-height: 1;
  margin-bottom: 5px;
}

.message__time {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: #a4a4a4;
}

.message__content {
  &:after {
    content: ' \00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0\00a0';
    display: inline;
  }

  span {
    display: block;
    font-weight: 800;
    margin-bottom: 5px;
  }

  img.giphy {
    max-width: 220px;
    border-radius: 4px;
    display: inline-block;
    width: 100%
  }

  img.emoji {
    width: 20px;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    top: -2px;
  }
}

.message__details-toggle {
  position: absolute;
  top: 5px;
  right: 10px;
  opacity: 0;
  transition: all .3s ease .3s;

  .message__body:hover & {
    opacity: 1;
  }

  &:before {
    line-height: 1;
    content: '\f107';
    font-size: 20px;
    width: 13px;
    height: 20px;
    display: block;
    font-family: FontAwesome;
    color: #a4a4a4;
  }
}

@media screen and (max-width: 480px) {
  .message {
    padding-right: 30px;

    &--owned {
      padding-right: 0;
      padding-left: 30px;
    }
  }
}
</style>
