import { shallowMount, createLocalVue } from "@vue/test-utils";
import BootstrapVue from "bootstrap-vue";
import Contact from "@/views/Contact.vue";

const localVue = createLocalVue();
localVue.use(BootstrapVue);

describe("Contact", () => {
    it("Contact page renders", () => {
        const wrapper = shallowMount(Contact, { localVue });
        expect(wrapper.isVueInstance()).toBe(true);
    });
});
