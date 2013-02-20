var Page = {

	js : {
		page0: function() {

		},

		page1: function() {
            
            $("#page1").live(
                "pagebeforeshow keyup",
                function () {
                    Gozintas.numGroups = parseInt($("#page1 #group_num").val());
                    numWantedGroups = Gozintas.numGroups;
                    numGroups = groups.length
                    if(numGroups < numWantedGroups){
                        for(var i = numGroups; i < numWantedGroups; i++){
                            addGroup();
                        }
                        Gozintas.numGroups = groups.length;
                    }else if(numGroups > numWantedGroups){
                        for(var i = numGroups; i > numWantedGroups; i--){
                            removeGroup();
                        }
                        Gozintas.numGroups = groups.length;
                    }
                    Gozintas.showSplitTipButtons(); 
                    if( isNaN(Gozintas.total.amount) ){
                        Gozintas.total.amount = 0;
                    }
                    if( isNaN(Gozintas.total.taxAmount) ){
                        Gozintas.total.taxAmount = 0;
                    }
                    if( (parseFloat(Gozintas.total.taxAmount) > parseFloat(Gozintas.total.amount)) || (Gozintas.total.amount ==0 ) || Gozintas.total.amount < 0 || Gozintas.total.taxAmount < 0){
                        $(".buttons").children().addClass('ui-disabled');
                    }else{
                        $(".buttons").children().removeClass('ui-disabled');
                    }
                }
            );


			$("#page1 #total_amount_input").on("change keyup", function() {
				Gozintas.total.amount = parseFloat($(this).val()).toFixed(2)

			})
			$("#page1 #total_tax_amount_input").on("change keyup", function() {
				Gozintas.total.taxAmount = parseFloat($(this).val()).toFixed(2)
			})
            $(".tabs-top").on('click', function(){
                Gozintas.showSplitTipButtons(); 
            });

            $("#page1 #group_num").on('click change keyup', function(){
                numWantedGroups = parseInt($("#page1 #group_num").val());
                numGroups = groups.length
                if(numGroups < numWantedGroups){
                    for(var i = numGroups; i < numWantedGroups; i++){
                        addGroup();
                    }
                    Gozintas.numGroups = groups.length;
                }else if(numGroups > numWantedGroups){
                    for(var i = numGroups; i > numWantedGroups; i--){
                        removeGroup();
                    }
                    Gozintas.numGroups = groups.length;
                }
            })



		},

		page2: function() {

            $("#page2").live('pagebeforeshow', function(){
                group_size = $("#page2 [class^='group-']").size();
                for(var i = group_size; i < groups.length; i++){
                    $("<div data-role='collapsible' data-content-theme='c' data-theme='a' id ='group-"+(group_size+1)+"' class='group-"+(group_size+1)+" visible' data-routing='group.html'><h3>Group "+(group_size+1)+"</h3></div>").appendTo('.groups');
                    $("<div data-role='collapsible' data-content-theme='c' data-theme='a' id ='group-"+(group_size+1)+"' class='group-"+(group_size+1)+" visible' data-routing='total.html'><h3>Group "+(group_size+1)+"</h3></div>").appendTo('.groups-final');
                    loadPartials(".group-"+(group_size+1)+"[data-routing]", false);
                }
            });


            $("#page2").live('pageload',function(){

            });

            $("#page2").live("pageshow keyup", function(){
                disable = false;
                total = 0;

                $.each(groups, function(index,value){
                    console.log("#1"+value.carryOutTotal)
                    console.log("#2"+value.wineTotal)
                    console.log("#3"+value.foodTotal)
                    total = total + value.carryOutTotal + value.wineTotal + value.foodTotal
                    if( value.peopleInParty == 0 || isNaN(value.peopleInParty) || value.foodTotal < 0 || value.wineTotal < 0 || value.carryOutTotal < 0 ){
                        disable = true
                    }
                })
                if( +total > +Gozintas.total.amount){
                    disable = true;
                }
                if(disable == true){
                    $(".buttons").children().addClass('ui-disabled');
                }else{
                    $(".buttons").children().removeClass('ui-disabled');
                }
            });

            $(".extra-popup input#drinks_deserts_etc").live('pageshow pageaftershow pageafterload keyup change', function(){
              extragroup = parseInt($(this).parent().parent().parent().attr('id').slice(-1));
              groups[extragroup-1].foodTotal = parseFloat($(this).val()).toFixed(2)
              if(groups[extragroup-1].foodTotal > 0){
                groups[extragroup-1].extras = true;
              }else{
                groups[extragroup-1].extras = false;
              }
            })

            $(".extra-popup input#wine_amount").live('pageshow pageaftershow pageafterload keyup change', function(){
              extragroup = parseInt($(this).parent().parent().parent().attr('id').slice(-1));
              parseFloat($(this).val()).toFixed(2)
              groups[extragroup-1].wineTotal = parseFloat($(this).val()).toFixed(2)
              if(groups[extragroup-1].wineTotal > 0){
                groups[extragroup-1].wine = true;
              }else{
                groups[extragroup-1].wine = false;
              }
            })

            $(".extra-popup input#carry_out_amount").live('pageshow pageaftershow pageafterload keyup change', function(){
              extragroup = parseInt($(this).parent().parent().parent().attr('id').slice(-1));
              groups[extragroup-1].carryOutTotal = parseFloat($(this).val()).toFixed(2)
              if(groups[extragroup-1].carryOutTotal > 0){
                groups[extragroup-1].carryout = true;
              }else{
                groups[extragroup-1].carryout = false;
              }
            })

			Gozintas.handleKeyups(3);
		},


		page2b: function() {

            $("#page2b").live('pageshow',function(){
                $("#page2b #drinks_deserts_etc").val(Gozintas.total.amount-Gozintas.total.taxAmount);
                $("#page2b #people_in_party").focusout(function() {
                    groups[0].peopleInParty = parseFloat($(this).val());
                });
            });

            $("#page2b").live('pageshow click keyup',function(){
                    parentClass = "#page2b";
                    peopleInParty = parseFloat($(parentClass+" #people_in_party").val())
                    if(isNaN(peopleInParty)){
                        peopleInParty = 0
                    }
                    if(isNaN(peopleInParty)){
                        peopleInParty = 0
                    }
                    groups[0].peopleInParty = peopleInParty
                    groups[0].foodTotal = +Gozintas.total.amount - +Gozintas.total.taxAmount
                    newFoodTotal = Gozintas.total.amount-Gozintas.total.taxAmount-groups[0].wineTotal-groups[0].carryOutTotal -groups[0].reductionTotal;
                    groups[0].foodTotal = newFoodTotal
                    
                    /*if(groups[0].foodTotal > 0){
                        groups[0].extras =true;
                    }else{
                        groups[0].extras = false
                    }*/

                    console.log(newFoodTotal)
                    $("#page2b #drinks_deserts_etc").val(+newFoodTotal.toFixed(2));
                    if( +newFoodTotal.toFixed(2) < 0 || isNaN(peopleInParty) || (peopleInParty <= 0) ){
                            $(".buttons").children().addClass('ui-disabled');
                    }else{
                            $(".buttons").children().removeClass('ui-disabled');
                    }
                
            })

		},

		page3: function() {

            $("#page3").live(
                "pagebeforeshow",
                function(){
                    Gozintas.showPageFourPercentages();
                    Gozintas.showPageFourButton();
                    $("#page3 #tip_rate").focusout(function() {
                        Gozintas.tip.general = parseFloat($(this).val());
                    });
                    $("#page3 #tax_tip_rate").focusout(function() {
                        Gozintas.tip.tax = parseFloat($(this).val());
                    });
                    $("#page3 #wine_tip_rate").focusout(function() {
                        Gozintas.tip.wine = parseFloat($(this).val());
                    });
                    $("#page3 #carry_tip_rate").focusout(function() {
                        Gozintas.tip.carryout = parseFloat($(this).val());
                    });
                    $("#page3 #tax_tip_rate").focusout(function() {
                        Gozintas.tip.tax = parseFloat($(this).val());
                    });
                }
            );


		},

		page4: function() {
            $("#page4").live(
                "pagebeforeshow",
                function () {
                    Gozintas.calculatePeopleInParty()
                    Gozintas.calculateTotalWithoutReduction()
                    Gozintas.individual.total = (+Gozintas.total.withoutReduction/Gozintas.peopleInParty).toFixed(2)
                    Gozintas.individual.tax = (+Gozintas.total.taxAmount/Gozintas.peopleInParty).toFixed(2)
                    Gozintas.calculateTaxAndTotal()

                    for(var i=0; i<groups.length; i++){
                        five_foodTotal = (+groups[i].total- +groups[i].taxTotal - +groups[i].foodTotal - groups[i].carryOutTotal - groups[i].wineTotal).toFixed(2)
                        five_tipTotal = ((+five_foodTotal)*Gozintas.tip.general + +groups[i].foodTotal*Gozintas.tip.general + +groups[i].carryOutTotal*Gozintas.tip.carryout + +groups[i].wineTotal*Gozintas.tip.wine + +groups[i].taxTotal*Gozintas.tip.tax).toFixed(2)
                        five_finalTotal = +groups[i].total + +five_tipTotal;
                        $("#page4 #group-"+(i+1)+" #individuals_in_party").val(groups[i].peopleInParty)
                        $("#page4 #group-"+(i+1)+" #total").val(five_finalTotal)
                        $("#page4 #group-"+(i+1)+" .food_total label").text("Bill Total ("+(Gozintas.tip.general*100).toFixed()+"% tip rate)")
                        $("#page4 #group-"+(i+1)+" #food_total").val(+five_foodTotal)
                        
                       $("#page4 #group-"+(i+1)+" #drinks_deserts_amount_container label").text("Drinks/Deserts/Etc ("+(Gozintas.tip.general*100).toFixed()+"% tip rate)")

                       $("#page4 #group-"+(i+1)+" #wine_amount_container label").text("Wine ("+(Gozintas.tip.wine*100).toFixed()+"% tip rate)")

                       $("#page4 #group-"+(i+1)+" #carry_out_amount_container label").text("Carry-out for group ("+(Gozintas.tip.carryout*100).toFixed()+"% tip rate)")
                        $("#page4 #group-"+(i+1)+" #total_individual").val((+five_finalTotal/+groups[i].peopleInParty).toFixed(2))
                        $("#page4 #group-"+(i+1)+" .tax_total label").text("Tax for group ("+(Gozintas.tip.tax*100).toFixed()+"% tip rate)")
                        $("#page4 #group-"+(i+1)+" #tax_total").val(+groups[i].taxTotal)
                        
                        $("#page4 #group-"+(i+1)+" #tip_total").val(five_tipTotal)
                        $("#page4 #group-"+(i+1)+" #tip_individual").val((five_tipTotal/groups[i].peopleInParty).toFixed(2))
                        Gozintas.showPageFiveGroupInputs(i);
                    }
                }
            );

		},

		page4b: function() {
            $("#page4b").live(
                "pagebeforeshow",
                function () {
                    if(Gozintas.billPath == "determine-tip" || (Gozintas.billPath == "split-tip" && Gozintas.splitBy == "individual")){
                        groups[0].foodTotal = +Gozintas.total.amount - +Gozintas.total.taxAmount
                    }

                    Gozintas.showPageFiveBInputs();
                }
            );
		},

        extras: function() {

            $("#extras").live(
                "pagebeforeshow", function(){
                    $("#extras").live('pageshow click keyup', function(){
                        parentClass = "#extras";
                        wineTotal = parseFloat($(parentClass+" #wine_amount").val()).toFixed(2);
                        carryOut = parseFloat($(parentClass+" #carry_out_amount").val()).toFixed(2);
                        if(isNaN(carryOut)){
                            carryOut = 0;
                        }
                        if(isNaN(wineTotal)){
                            wineTotal = 0;
                        }
                        groups[0].wineTotal = wineTotal;
                        groups[0].carryOutTotal = carryOut;
                        if(groups[0].wineTotal > 0){
                            groups[0].wine = true;
                        }else{
                            groups[0].wine = false;
                        }
                        if(groups[0].carryOutTotal > 0){
                            groups[0].carryout = true;
                        }else{
                            groups[0].carryout = false;
                        }

                    });

                }
            );

        },

        settings: function() {

        }


	}

}

