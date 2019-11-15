<template>
    <body>
        <div class="container" style="padding:10px 10px;">
            <h1>Generate Table from Qualtrics CSV</h1>
            <div class="well">
                <div class="row">
                    <form class="form-inline">
                        <label for="files2">Upload a CSV formatted file:</label>
                        <p style="padding: 0 0.5em 0 0;"/>
                        <input v-on:change="setFile" type="file" id="files2"  class="form-control" accept=".csv" required />
                        <div v-if="uploaded" class="form-group">
                            <button v-on:click="dataParse" type="submit" id="json-file" class="btn btn-primary">Show JSON</button>
                        </div>
                        <div v-if="uploaded" class="form-group">
                            <button v-on:click="emailParse" type="submit" id="email-btn" class="btn btn-primary">Generate Email List</button>
                        </div>
                    </form>
                </div>        
            </div>
            <div class="row" id="parsed_csv_list">
            </div>
            <div class="well">
                <svg id="dataChart"></svg>
            </div>
            <p>{{ JSONoutput }}</p>
        </div>	
    </body>
</template>

<script>
import math from "@/assets/math.min.js"
import "@/assets/FileSaver.js"
import Papa from "@/assets/papaparse.min.js"
const d3 = require('d3');

export default {
    data: function() {
        return {
            inputFile: File,
            uploaded: false,
            JSONoutput: ""
        }
    },
    methods: {
        setFile: function(event) {
            this.inputFile = event.target.files[0]
            this.uploaded = true
        },
        dataParse: function(event) {
            event.preventDefault()
            Papa.parse(this.inputFile, {
                delimiter: "auto",
                complete: this.dataFormat
            });
        },
        emailParse: function(event) {
            event.preventDefault()
            Papa.parse(this.inputFile, {
                delimiter: "auto",
                complete: this.generateEmail
            });
        },
        dataFormat: function(results) {
            var data = results.data;
            var emailNum = -1;
            var emailList = [];
            var data_obj = {
                        familiarity:{canada_thistle:{values: []}, leafy_spurge:{values: []},musk_thistle:{values: []}, plumeless_thistle:{values: []}, sericea_lespedeza:{values: []}, 
                        spotted_diffuse_knapweed:{values: []}, russian_olive:{values: []}, scotch_thistle:{values: []}, eastern_redcedar:{values: []}, smooth_brome:{values: []}},

                    forage_imp:{canada_thistle:{values: []}, leafy_spurge:{values: []},musk_thistle:{values: []}, plumeless_thistle:{values: []}, sericea_lespedeza:{values: []}, 
                        spotted_diffuse_knapweed:{values: []}, russian_olive:{values: []}, scotch_thistle:{values: []}, eastern_redcedar:{values: []}, smooth_brome:{values: []}},

                    forage_unc:{canada_thistle:{values: []}, leafy_spurge:{values: []},musk_thistle:{values: []}, plumeless_thistle:{values: []}, sericea_lespedeza:{values: []}, 
                        spotted_diffuse_knapweed:{values: []}, russian_olive:{values: []}, scotch_thistle:{values: []}, eastern_redcedar:{values: []}, smooth_brome:{values: []}},

                    livestock_imp:{canada_thistle:{values: []}, leafy_spurge:{values: []},musk_thistle:{values: []}, plumeless_thistle:{values: []}, sericea_lespedeza:{values: []}, 
                        spotted_diffuse_knapweed:{values: []}, russian_olive:{values: []}, scotch_thistle:{values: []}, eastern_redcedar:{values: []}, smooth_brome:{values: []}},

                    livestock_unc:{canada_thistle:{values: []}, leafy_spurge:{values: []},musk_thistle:{values: []}, plumeless_thistle:{values: []}, sericea_lespedeza:{values: []}, 
                        spotted_diffuse_knapweed:{values: []}, russian_olive:{values: []}, scotch_thistle:{values: []}, eastern_redcedar:{values: []}, smooth_brome:{values: []}}, 

                    water_imp:{canada_thistle:{values: []}, leafy_spurge:{values: []},musk_thistle:{values: []}, plumeless_thistle:{values: []}, sericea_lespedeza:{values: []}, 
                        spotted_diffuse_knapweed:{values: []}, russian_olive:{values: []}, scotch_thistle:{values: []}, eastern_redcedar:{values: []}, smooth_brome:{values: []}},

                    water_unc:{canada_thistle:{values: []}, leafy_spurge:{values: []},musk_thistle:{values: []}, plumeless_thistle:{values: []}, sericea_lespedeza:{values: []}, 
                        spotted_diffuse_knapweed:{values: []}, russian_olive:{values: []}, scotch_thistle:{values: []}, eastern_redcedar:{values: []}, smooth_brome:{values: []}},

                    wildfood_imp:{canada_thistle:{values: []}, leafy_spurge:{values: []},musk_thistle:{values: []}, plumeless_thistle:{values: []}, sericea_lespedeza:{values: []}, 
                        spotted_diffuse_knapweed:{values: []}, russian_olive:{values: []}, scotch_thistle:{values: []}, eastern_redcedar:{values: []}, smooth_brome:{values: []}},

                    wildfood_unc:{canada_thistle:{values: []}, leafy_spurge:{values: []},musk_thistle:{values: []}, plumeless_thistle:{values: []}, sericea_lespedeza:{values: []}, 
                        spotted_diffuse_knapweed:{values: []}, russian_olive:{values: []}, scotch_thistle:{values: []}, eastern_redcedar:{values: []}, smooth_brome:{values: []}},

                    forest_product_imp:{canada_thistle:{values: []}, leafy_spurge:{values: []},musk_thistle:{values: []}, plumeless_thistle:{values: []}, sericea_lespedeza:{values: []}, 
                        spotted_diffuse_knapweed:{values: []}, russian_olive:{values: []}, scotch_thistle:{values: []}, eastern_redcedar:{values: []}, smooth_brome:{values: []}},

                    forest_product_unc:{canada_thistle:{values: []}, leafy_spurge:{values: []},musk_thistle:{values: []}, plumeless_thistle:{values: []}, sericea_lespedeza:{values: []}, 
                        spotted_diffuse_knapweed:{values: []}, russian_olive:{values: []}, scotch_thistle:{values: []}, eastern_redcedar:{values: []}, smooth_brome:{values: []}},

                    pollination_imp:{canada_thistle:{values: []}, leafy_spurge:{values: []},musk_thistle:{values: []}, plumeless_thistle:{values: []}, sericea_lespedeza:{values: []}, 
                        spotted_diffuse_knapweed:{values: []}, russian_olive:{values: []}, scotch_thistle:{values: []}, eastern_redcedar:{values: []}, smooth_brome:{values: []}},

                    pollination_unc:{canada_thistle:{values: []}, leafy_spurge:{values: []},musk_thistle:{values: []}, plumeless_thistle:{values: []}, sericea_lespedeza:{values: []}, 
                        spotted_diffuse_knapweed:{values: []}, russian_olive:{values: []}, scotch_thistle:{values: []}, eastern_redcedar:{values: []}, smooth_brome:{values: []}},

                    eco_integrity_imp:{canada_thistle:{values: []}, leafy_spurge:{values: []},musk_thistle:{values: []}, plumeless_thistle:{values: []}, sericea_lespedeza:{values: []}, 
                        spotted_diffuse_knapweed:{values: []}, russian_olive:{values: []}, scotch_thistle:{values: []}, eastern_redcedar:{values: []}, smooth_brome:{values: []}}, 

                    eco_integrity_unc:{canada_thistle:{values: []}, leafy_spurge:{values: []},musk_thistle:{values: []}, plumeless_thistle:{values: []}, sericea_lespedeza:{values: []}, 
                        spotted_diffuse_knapweed:{values: []}, russian_olive:{values: []}, scotch_thistle:{values: []}, eastern_redcedar:{values: []}, smooth_brome:{values: []}},

                    biodiversity_imp:{canada_thistle:{values: []}, leafy_spurge:{values: []},musk_thistle:{values: []}, plumeless_thistle:{values: []}, sericea_lespedeza:{values: []}, 
                        spotted_diffuse_knapweed:{values: []}, russian_olive:{values: []}, scotch_thistle:{values: []}, eastern_redcedar:{values: []}, smooth_brome:{values: []}},

                    biodiversity_unc:{canada_thistle:{values: []}, leafy_spurge:{values: []},musk_thistle:{values: []}, plumeless_thistle:{values: []}, sericea_lespedeza:{values: []}, 
                        spotted_diffuse_knapweed:{values: []}, russian_olive:{values: []}, scotch_thistle:{values: []}, eastern_redcedar:{values: []}, smooth_brome:{values: []}},

                    scale_size:{canada_thistle:{values: []}, leafy_spurge:{values: []},musk_thistle:{values: []}, plumeless_thistle:{values: []}, sericea_lespedeza:{values: []}, 
                        spotted_diffuse_knapweed:{values: []}, russian_olive:{values: []}, scotch_thistle:{values: []}, eastern_redcedar:{values: []}, smooth_brome:{values: []}},

                    scale_unc:{canada_thistle:{values: []}, leafy_spurge:{values: []},musk_thistle:{values: []}, plumeless_thistle:{values: []}, sericea_lespedeza:{values: []}, 
                        spotted_diffuse_knapweed:{values: []}, russian_olive:{values: []}, scotch_thistle:{values: []}, eastern_redcedar:{values: []}, smooth_brome:{values: []}}};
            var l1 = Object.keys(data_obj);
            var l2 = Object.keys(data_obj[l1[0]]);
            
            for(var i = 3; i < data.length; i++) {
                var row = data[i];
                var cells = row.join(",").split(",");
                var q = 0;
                emailList.push(cells[11]);
                var responses = cells.slice(19);
                
                for(var j = 0; j < l1.length; j++) {
                    for(var k = 0; k < l2.length; k++) {
                        data_obj[l1[j]][l2[k]].values.push(parseInt(responses[q], 10));
                        data_obj[l1[j]][l2[k]].sum = data_obj[l1[j]][l2[k]].values.filter(Boolean).reduce((total, num) => total + num);
                        data_obj[l1[j]][l2[k]].n = data_obj[l1[j]][l2[k]].values.filter(Boolean).length;
                        if(q == 9 || q >= 10 && math.floor(q / 10) % 2 != 0) {
                            data_obj[l1[j]][l2[k]].mean = (data_obj[l1[j]][l2[k]].sum / data_obj[l1[j]][l2[k]].n - 6);
                        }
                        else {
                            data_obj[l1[j]][l2[k]].mean = (data_obj[l1[j]][l2[k]].sum / data_obj[l1[j]][l2[k]].n);
                        }
                        data_obj[l1[j]][l2[k]].sd = math.std(data_obj[l1[j]][l2[k]].values.filter(Boolean));
                        data_obj[l1[j]][l2[k]].se = (data_obj[l1[j]][l2[k]].sd) / (math.sqrt(data_obj[l1[j]][l2[k]].n));
                        q += 1;
                    }
                }	
            }
            this.JSONoutput = JSON.stringify(data_obj);
            this.chartData(data_obj);
        },
        chartData: function(inc_data) {
            var svg = d3.select("#dataChart");
            var width = 500;
            var height = 300;
            
            var plantData = [];
            for (var category in inc_data) {
                var categoryObj = { name: category }
                var categoryData = [];
                var index = 1;
                for (var plant in inc_data[category]) {
                    categoryData.push({
                                        pos: index, 
                                        name: plant, 
                                        val: inc_data[category][plant].sum
                    });
                    index += 1;
                }
                categoryObj.plants = categoryData;
                plantData.push(categoryObj);
            }
            console.log(plantData);
            
            function addRectsWithName(elem, name, rectData) {
                var x = d3.scaleBand()
                    .rangeRound([0, width]).padding(0.1)
                    .domain(rectData.map(d => d.pos));
                var y = d3.scaleLinear()
                    .rangeRound([height * 0.3 - 20, 0])
                    .domain([0, d3.max(rectData, d => d.val)])

                elem
                    .append('text')
                    .text(name)
                    .attr('x', width / 2)
                    .attr('y', -20)
                    .attr('text-anchor', 'middle');
                elem.selectAll('rect')
                    .data(rectData)
                    .enter()
                        .append('rect')
                        .attr('x', d => x(d.pos))
                        .attr('class', d => d.name)
                        .attr('y', d => y(d.val))
                        .attr('width', x.bandwidth())
                        .attr('height', d => y.range()[0] - y(d.val))
                        .attr('fill', '#' + (Math.random() * 0xFFFFFF << 0).toString(16))
                            .append('title')
                            .text(d => d.name)
            }

            var offset = 0;
            var shift = false;
            for (var category in plantData) {
                if (shift) {
                    svg
                    .append('g')
                    .attr('transform', `translate(${width + 80}, ${height * offset + 60})`)
                    .call(addRectsWithName, plantData[category].name, plantData[category].plants);
                    offset += 0.6;
                }
                else {
                    svg
                    .append('g')
                    .attr('transform', `translate(0, ${height * offset + 60})`)
                    .call(addRectsWithName, plantData[category].name, plantData[category].plants);
                }
                shift = !shift;
            }
            svg
                .attr('height', height * offset - 30)
                .attr('width', width * 2 + 80);
        },
        generateEmail: function(results) {
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
    }
}
</script>

<style scoped>
    @import "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css";

    .pdfobject-container { height: 500px;}
    .pdfobject { border: 1px solid #666; }
</style>
