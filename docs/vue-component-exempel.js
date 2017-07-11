export default {

  props: {
    name: true,
  }, // definera komponentens prop (parameters)

  data() {
    return {
      greet: 'Hello'
    }
  }, // komponentens data

  computed: {
    greetings() {
      return `${this.greet} ${this.name}!`;
    },
  }, // en förvrägning av något data property

  watch: {
    name() {
      console.log('Name as changed!')
    }
  }, // om något i 'data' eller 'computed' har ändrats

  methods: {}, // alla metoder som tillhör komponenten

  components: {} // definera upp komponeter som används i denna komponent

  // Vue's life cycle

  beforeCreate() {},

  created() {},

  beforeMount() {},

  mounted() {}, // tillgång till DOM:en

  beforeDestory() {},

  destroyed() {},

};
