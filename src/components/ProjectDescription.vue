<template>
    <div>
        <h5>
            <router-link :to="{ name: 'dashboard', query: { id: project.projectId, view: 'live' } }">{{
                project.name
            }}</router-link>
        </h5>
        <p>{{ project.description }}</p>
    </div>
</template>

<script>
export default {
    name: "ProjectDescription",
    props: ["project"]
};
</script>
