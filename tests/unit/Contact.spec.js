import { shallowMount } from "@vue/test-utils";
import contact from "@/views/Contact.vue";

describe("Contact", () => {
    it("Contact page renders", () => {
        const wrapper = shallowMount(contact);
        expect(wrapper.isVueInstance()).toBe(true);
    });
});
