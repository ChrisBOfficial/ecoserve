import { shallowMount, createLocalVue } from "@vue/test-utils";
import VueRouter from "vue-router";
import BootstrapVue from "bootstrap-vue";
import Header from "@/components/Header.vue";

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(BootstrapVue);

describe("Header", () => {
    it("Header component renders", () => {
        const wrapper = shallowMount(Header, { localVue });
        expect(wrapper.isVueInstance()).toBe(true);
    });
});
