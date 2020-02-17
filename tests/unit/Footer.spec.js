import { shallowMount, createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import Footer from "@/components/Footer.vue";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe("Footer", () => {
    it("Footer component renders", () => {
        const wrapper = shallowMount(Footer, { localVue });
        expect(wrapper.isVueInstance()).toBe(true);
    });
});
