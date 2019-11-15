<template>
    <body>
        <div class="container" style="padding:10px 10px;">
            <h1>Generate Table from Qualtrics CSV</h1>
            <div class="well">
                <div class="row">
                    <form class="form-inline">
                        <div class="form-group">
                            <label for="files2">Upload a CSV formatted file:</label>
                            <input @change="setFile" type="file" id="files2"  class="form-control" accept=".csv" required />
                        </div>
                        <div class="form-group">
                            <button v-on:click="emailParse" type="submit" id="email-btn" class="btn btn-primary">Generate Email List</button>
                        </div>
                        <div class="form-group">
                            <button type="submit" id="submit-file" class="btn btn-primary">Generate Table</button>
                        </div>
                        <div class="form-group">
                            <button type="submit" id="json-file" class="btn btn-primary">Show JSON</button>
                        </div>
                    </form>
                </div>        
            </div>
            <div class="row" id="parsed_csv_list">
            </div>
            <p id="JSONoutput"></p>
        </div>	
    </body>
</template>

<script>
import "@/assets/math.min.js"
import "@/assets/FileSaver.js"
import Papa from "@/assets/papaparse.min.js"

export default {
    data () {
        return {
            inputFile: File
        }
    },
    methods: {
        setFile: function(event) {
            this.inputFile = event.target.files[0]
        },
        emailParse: function(event) {
            event.preventDefault()
            Papa.parse(this.inputFile, {
                delimiter: "auto",
                complete: generateEmail
            });
        }
    }
}

function generateEmail(results) {
    var data = results.data;
	var emailNum = -1;
    var emailList = "";

    for(var i = 0; i < data.length; i++) {
        var row = data[i];
        var cells = row.join(",").split(",");
        if(i != 1 && i != 2) {
            for(var j = 0; j < cells.length; j++) {
                if (cells[j] == "RecipientEmail") {
				    emailNum = j;
                } 
                else if(j == emailNum) {
					emailList += cells[j];
					emailList += "; ";
				}
            }
        }
    }

    var blob = new Blob([emailList], {type: "text/plain;charset=utf-8"});
	saveAs(blob, "testfile1.txt");
}
</script>

<style scoped>
    @import "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css";

    .pdfobject-container { height: 500px;}
	.pdfobject { border: 1px solid #666; }
</style>
