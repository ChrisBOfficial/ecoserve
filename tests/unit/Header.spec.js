import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import userModule from "../../src/store/modules/users";
import VueRouter from "vue-router";
import BootstrapVue from "bootstrap-vue";
import Header from "@/components/Header.vue";

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueRouter);
localVue.use(BootstrapVue);

describe("Header", () => {
    let store;
    beforeEach(() => {
        store = new Vuex.Store({
            modules: {
                userModule: {
                    state: userModule.state,
                    actions: userModule.actions
                }
            }
        });
    });

    it("Header component renders", () => {
        const wrapper = shallowMount(Header, { store, localVue });
        expect(wrapper.isVueInstance()).toBe(true);
    });
});
