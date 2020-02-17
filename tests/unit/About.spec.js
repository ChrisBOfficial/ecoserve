import { shallowMount } from "@vue/test-utils";
import about from "@/views/About.vue";

describe("About", () => {
    it("About page renders", () => {
        const wrapper = shallowMount(about);
        expect(wrapper.isVueInstance()).toBe(true);
    });
});
