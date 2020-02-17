import { shallowMount, createLocalVue } from "@vue/test-utils";
import VueRouter from "vue-router";
import Footer from "@/components/Footer.vue";

const localVue = createLocalVue();
localVue.use(VueRouter);

describe("Footer", () => {
    it("Footer component renders", () => {
        const wrapper = shallowMount(Footer, { localVue });
        expect(wrapper.isVueInstance()).toBe(true);
    });
});
