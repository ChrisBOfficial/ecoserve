<template>
    <b-row class="align-items-center">
        <b-col class="col-md-9">
            <h5>
                <router-link :to="{ name: 'dashboard', query: { id: project.projectId, view: 'live' } }">{{
                    project.name
                }}</router-link>
            </h5>
            <p>{{ project.description }}</p>
        </b-col>
        <b-col class="col-md-1">
            <router-link
                :to="{ name: 'editProject', query: { id: project.projectId } }"
                tag="b-button"
                style="background-color:DarkSeaGreen;"
                >E</router-link
            >
        </b-col>
    </b-row>
</template>

<script>
export default {
    name: "ProjectDescription",
    props: ["project"]
};
</script>
