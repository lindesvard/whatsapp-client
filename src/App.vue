<template>
  <div class="app">

    <div class="login" v-if="user.id === null">
      <input type="text" placeholder="Skriv ett användarnamn" @keyup.enter.prevent="($event) => join({ name: $event.target.value })" autofocus>
    </div>

    <div class="chat-container">

      <div class="user-list">
        <button class="user-list__toggle" @click.prevnet="($event) => $event.currentTarget.parentElement.classList.toggle('active')">
          <span>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <div :class="{'typing': isTyping(listUser), 'you': user.id === listUser.id}" v-for="(listUser, index) in users">
          {{listUser.name}} <wa-dots v-show="isTyping(listUser)" />
        </div>
      </div>

      <div class="chat">
        <div class="chat__messages-container" ref="messageContainer">

          <div class="chat__messages">
            <wa-message v-for="(message, index) in sortedMessages" :key="index" :message="message"/>
          </div> <!-- /.chat__messages -->

        </div> <!-- /.chat__messages-container -->

        <div class="chat__reply">
          <textarea placeholder="Skriv ett meddelande" @keydown.enter.prevent="send" v-model="content" ref="reply"></textarea>
        </div> <!-- /.chat__reply -->

      </div> <!-- /.chat -->
    </div> <!-- /.chat-container -->

  </div>
</template>

<script>
const API_URL = 'http://chatapi.simplifier.se';

import Dots from './Dots.vue';
import Message from './Message.vue';
const socket = io(API_URL);

let typingTimer;
let typing = false;

function sortByDate(a, b) {
  return new Date(a.datetime) - new Date(b.datetime);
}

export default {
  data () {
    return {
      messages: [],
      content: '',
      peopleTyping: [],
      users: [],
      user: this.$store.state.user,
    }
  },
  computed: {
    sortedMessages() {
      return this.messages.sort(sortByDate);
    },
  },
  watch: {
    messages() {
      this.scrollToBottom();
    },

    content(content, oldContent) {
      if (typingTimer) {
        clearTimeout(typingTimer);
      }

      if (typing === false) {
        typing = true;
        socket.emit('start typing', this.user);
      }

      typingTimer = setTimeout(() => {
        typing = false;
        socket.emit('stop typing', this.user);
      }, 400);
    },
  },
  methods: {
    isTyping(user) {
      return this.peopleTyping.filter((u) => u.id === user.id).length === 1;
    },

    scrollToBottom() {
      const {messageContainer} = this.$refs;

      this.$nextTick(() => {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      });
    },

    send() {
      if (this.content === '') return;

      socket.emit('add message', {
        content: this.content,
        user: this.user,
      });

      this.content = '';
    },

    join(user) {
      this.$store.setUser(user);
      socket.emit('join channel', this.user);
      window.onunload = () => socket.emit('leave channel', { id: this.user.id });
    },

    recievePeopleTyping(list) {
      this.peopleTyping = list;
    },

    fetchMessages() {
      fetch(`${API_URL}/messages`)
        .then((response) => response.json())
        .then((messages) => {
          messages.forEach(this.recieveMessage);
        });
    },

    recieveMessage(message) {
      this.loadImage(message.content)
        .then(() => this.messages.push(message));
    },

    loadImage(content) {
      return new Promise((resolve, reject) => {
        const div = document.createElement('div');
        div.innerHTML = content;

        const isGiphy = div.querySelector('img.giphy');

        if (isGiphy) {
          const image = new Image();
          image.onload = resolve;
          image.src = isGiphy.src;
        } else {
          resolve();
        }
      });
    },

    updateUserList(data) {
      this.users = data.userList;
    },

  },

  beforeMount() {
    socket.on('user joined', this.updateUserList);
    socket.on('user left', this.updateUserList);
    socket.on('new message', this.recieveMessage);
    socket.on('typing', this.recievePeopleTyping);

    // are we already login?
    if (this.user.id) {
      this.join(this.user);
    }

    this.fetchMessages();
  },

  components: {
    'wa-message': Message,
    'wa-dots': Dots,
  }
};
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

*::-webkit-scrollbar {
  width: 6px !important;
  height: 6px !important;
}

*::-webkit-scrollbar-thumb {
  background-color: rgba(0,0,0,0.2);
}

*::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.08);
}

html, body {
  min-height: 100%;
}

body {
  font-family: 'Open Sans', sans-serif;
  font-size: 14px;
  background: #343d46;
  background: linear-gradient(#3f4750, #283038);

  &:before {
    content: '';
    background-image: url(/dist/pattern.png?8a055527b27b887521a9f084497d8879);
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    opacity: .05;
    height: 100%;
    min-height: 100%;
  }
}

select, textarea, input[type='text'], input[type='password'], input[type='datetime'], input[type='datetime-local'], input[type='date'], input[type='month'], input[type='time'], input[type='week'], input[type='number'], input[type='email'], input[type='url'], input[type='search'], input[type='tel'], input[type='color'] { font-size: 14px; }

.app {
  height: 80vh;
  max-width: 600px;
  margin: 10vh auto 0;
  padding: 10px;
  position: relative;
  display: flex;
  flex: 1;
}

.chat-container {
  display: flex;
  max-width: 100%;
  flex: 1;
}

.user-list {
  min-width: 150px;
  display: flex;
  max-height: 100%;
  overflow-y: auto;
  flex-direction: column;
  padding-right: 10px;
  transition: min-width .2s ease;

  &.active {
    min-width: 150px;
  }

  div:not(.dots) {
    order: 3;
    color: #e5ddd5;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
  }

  .you {
    order: 1 !important;
    font-weight: 800;
  }

  .typing {
    order: 2 !important;
  }
}

.user-list__toggle {
  display: none;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 999;
  border-radius: 35px;
  height: 40px;
  width: 40px;
  background: rgba(0,0,0,.4);
  border: 0;
  cursor: pointer;

  &:focus {
    outline: 0;
  }

  > span {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  > span > span {
    display: block;
    width: 25px;
    height: 4px;
    background: #fff;
    margin-bottom: 4px;
    border-radius: 4px;
  }

  span:last-child {
    margin-bottom: 0;
  }
}

.chat {
  display: flex;
  flex-direction: column;
  flex: 1;
  max-width: 100%;
}

.chat__messages-container {
  height: 60vh;
  overflow-y: scroll;
  overflow-x: hidden;
  border-radius: 4px;
  background-color: #e5ddd5;
  -webkit-overflow-scrolling: touch;
}

.chat__messages {
  position: relative;
  padding: 20px;
  min-height: 100%;

  &:before {
    content: '';
    background-image: url('./assets/pattern.png');
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    opacity: .05;
    height: 100%;
    min-height: 100%
  }
}

@media screen and (max-width: 480px) {
  body, select, textarea, input[type='text'], input[type='password'], input[type='datetime'], input[type='datetime-local'], input[type='date'], input[type='month'], input[type='time'], input[type='week'], input[type='number'], input[type='email'], input[type='url'], input[type='search'], input[type='tel'], input[type='color'] {
    font-size: 16px;
  }

  .app {
    overflow: hidden;
    margin: 0;
  }

  .chat__messages-container {
    height: 100%;
    flex: 1;
  }

  .chat__messages {
    padding: 10px;
    min-height: 100%
  }

  .message {
    padding-right: 30px;

    &--owned {
      padding-right: 0;
      padding-left: 30px;
    }
  }

  .user-list {
    padding: 0;
    overflow: hidden;
    min-width: 0;
    width: 0;
  }

  .user-list__toggle {
    display: block;
  }
}

textarea, input {
  font-family: 'Open Sans', sans-serif;
  width: 100%;
  height: 43px;
  display: block;
  border: 0;
  border-radius: 4px;
  padding: 10px;
  resize: none;
  margin-top: 10px;
  transition: box-shadow .3s ease;
  box-shadow: 0 0 0px 0 rgba(0,0,0,0);
  overflow: hidden;

  &:focus {
    outline: 0;
    box-shadow: 0 0 0px 2px #35cd96;
  }
}

.login {
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    background: rgba(52, 61, 70, 0.9);
    border-radius: 9px;
}

.login input {
  max-width: 200px;
}
</style>
