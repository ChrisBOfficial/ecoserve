import { shallowMount, createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import About from "@/views/About.vue";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe("About", () => {
    it("About page renders", () => {
        const wrapper = shallowMount(About, { localVue });
        expect(wrapper.isVueInstance()).toBe(true);
    });
});
