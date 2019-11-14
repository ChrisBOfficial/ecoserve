<template>
    <body>
        <div class="container" style="padding:10px 10px;">
            <h1>Generate Table from Qualtrics CSV</h1>
	        <div class="well">
		        <div class="row">
		            <form class="form-inline">
			            <div class="form-group">
			                <label for="files">Upload a CSV formatted file:</label>
			                <input type="file" id="files"  class="form-control" accept=".csv" required />
			            </div>
			            <div class="form-group">
			                <button type="submit" id="submit-file" class="btn btn-primary">Upload File</button>
			                <button id="email-btn">Generate Email List</button>
			            </div>
		            </form>
		        </div>
                <div class="row">
                    <div class="row" id="parsed_csv_list">
                    </div>
                </div>
	        </div>
        </div>
    </body>
</template>

<script>
import "@/assets/papaparse.min.js"
import "@/assets/math.min.js"
import "@/assets/FileSaver.js"

export default {

}
</script>

<style scoped>
    @import "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css";
    @import "../assets/style.css";

    .pdfobject-container { height: 500px;}
	.pdfobject { border: 1px solid #666; }
</style>
