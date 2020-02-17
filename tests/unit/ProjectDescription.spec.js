import { shallowMount, createLocalVue } from "@vue/test-utils";
import VueRouter from "vue-router";
import BootstrapVue from "bootstrap-vue";
import ProjectDescription from "@/components/ProjectDescription.vue";

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(BootstrapVue);

const testProject = { projectId: "A test ID", name: "A test name", description: "A test description" };

describe("ProjectDescription", () => {
    it("ProjectDescription component renders", () => {
        const wrapper = shallowMount(ProjectDescription, {
            localVue,
            propsData: {
                project: testProject
            }
        });
        expect(wrapper.isVueInstance()).toBe(true);
        expect(wrapper.vm.project).toBe(testProject);
    });
});
