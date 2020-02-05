<template>
    <div>
        <h5>
            <a href="url">{{project.name}}</a>
        </h5>
        <p>
            {{project.description}}
        </p>
    </div>
</template>

<script>
export default {
    name: "ProjectDescription",
    props: ['project']
}

</script>