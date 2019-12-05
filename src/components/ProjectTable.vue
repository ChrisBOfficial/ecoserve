<template>
    <div>
        <b-form>
            <b-form-group id="projectTitleGroup" label="Project Title: ">
                <b-form-input 
                    id="projectTitleInput"
                    type="text"
                    v-model="formData.title"
                    required placeholder="Project Title"
                />
            </b-form-group>

            
            <b-form-group id="projectDescriptionGroup" label="Project Description: ">
                <b-form-input 
                    id="projectDescriptionInput"
                    type="text"
                    v-model="formData.description"
                    required placeholder="Enter Project Description"
                />
            </b-form-group>
        </b-form>

    </div>
</template>


<script>
export default{
    name: 'project-table',
    data(){
        return{
            formData:{
                title: '',
                description: ''
            }
        }
    }, 
    
    methods:{
        handleSubmit(){
            const{title,description} = this.formData
            //000000 is place holder for project id. we will autogenerate id
            //might be better to return these value to NewProject.vue or 
            //ExistingProject.vue as values rather than putting it in a json 
            //object here. 
            const payload = {
                '000000' : {
                    title,
                    description
                } 
            }
        }
    }
}

</script>