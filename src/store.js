import guid from './guid';

export default {
  state: {
    user: {
      id: null,
      name: null,
    },
  },
  setUser(user) {
    if (!user.id) {
      user.id = guid();
    }

    this.state.user = Object.assign(this.state.user, user);

    localStorage.setItem('user', JSON.stringify(this.state.user));
  },
  init() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      this.state.user = user;
    }
  }
}
