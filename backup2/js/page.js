var Page = {

	js : {
		page1: function() {

		},

		page2: function() {
            $("#page2").live(
                "pagebeforeshow keyup",
                function () {
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
			$("#page2 #total_amount_input").on("change keyup", function() {
				Gozintas.total.amount = parseFloat($(this).val()).toFixed(2)

			})
			$("#page2 #total_tax_amount_input").on("change keyup", function() {
				Gozintas.total.taxAmount = parseFloat($(this).val()).toFixed(2)
			})

            

		},

		page3: function() {

            $("#page3").live("pageshow keyup", function(){
                disable = false;
                total = 0;
                $.each(groups, function(index,value){
                    value.carryOutTotal
                    value.wineTotal
                    value.foodTotal
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
			Gozintas.handleKeyups(3);
		},


		page3b: function() {

            $("#page3b").live('pageshow',function(){
                $("#page3b #drinks_deserts_etc").val(Gozintas.total.amount-Gozintas.total.taxAmount);
                $("#page3b #people_in_party").focusout(function() {
                    groups[0].peopleInParty = parseFloat($(this).val());
                });
            });

            $("#page3b").live('pageshow click keyup',function(){
                    parentClass = "#page3b";
                    peopleInParty = parseFloat($(parentClass+" #people_in_party").val())
                    wineTotal = parseFloat($(parentClass+" #wine_amount").val()).toFixed(2);
                    carryOut = parseFloat($(parentClass+" #carry_out_amount").val()).toFixed(2);
                    if(isNaN(peopleInParty)){
                        peopleInParty = 0
                    }
                    if(isNaN(carryOut)){
                        carryOut = 0
                    }
                    if(isNaN(wineTotal)){
                        wineTotal = 0
                    }
                    if(isNaN(peopleInParty)){
                        peopleInParty = 0
                    }
                    groups[0].peopleInParty = peopleInParty
                    groups[0].wineTotal = wineTotal;
                    groups[0].carryOutTotal = carryOut
                    groups[0].foodTotal = +Gozintas.total.amount - +Gozintas.total.taxAmount
                    newFoodTotal = Gozintas.total.amount-Gozintas.total.taxAmount-groups[0].wineTotal-groups[0].carryOutTotal -groups[0].reductionTotal;
                    groups[0].foodTotal = newFoodTotal
                    
                    if(groups[0].foodTotal > 0){
                        groups[0].extras =true;
                    }else{
                        groups[0].extras = false
                    }
                    if(groups[0].wineTotal > 0){
                        groups[0].wine = true
                    }else{
                        groups[0].wine = false
                    }
                    if(groups[0].carryOutTotal > 0){
                        groups[0].carryout = true
                    }else{
                        groups[0].carryout = false
                    }
                    console.log(newFoodTotal)
                    $("#page3b #drinks_deserts_etc").val(+newFoodTotal.toFixed(2));
                    if( +newFoodTotal.toFixed(2) < 0 || isNaN(peopleInParty) || (peopleInParty <= 0) || carryOut < 0 || wineTotal < 0  ){
                            $(".buttons").children().addClass('ui-disabled');
                    }else{
                            $(".buttons").children().removeClass('ui-disabled');
                    }




                
            })

		},

		page4: function() {

            $("#page4").live(
                "pagebeforeshow",
                function(){
                    Gozintas.showPageFourPercentages();
                    Gozintas.showPageFourButton();
                    $("#page4 #tip_rate").focusout(function() {
                        Gozintas.tip.general = parseFloat($(this).val());
                    });
                    $("#page4 #tax_tip_rate").focusout(function() {
                        Gozintas.tip.tax = parseFloat($(this).val());
                    });
                    $("#page4 #wine_tip_rate").focusout(function() {
                        Gozintas.tip.wine = parseFloat($(this).val());
                    });
                    $("#page4 #carry_tip_rate").focusout(function() {
                        Gozintas.tip.carryout = parseFloat($(this).val());
                    });
                    $("#page4 #tax_tip_rate").focusout(function() {
                        Gozintas.tip.tax = parseFloat($(this).val());
                    });
                }
            );


		},

		page5: function() {
            $("#page5").live(
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
                        $("#page5 #group-"+(i+1)+" #individuals_in_party").val(groups[i].peopleInParty)
                        $("#page5 #group-"+(i+1)+" #total").val(five_finalTotal)
                        $("#page5 #group-"+(i+1)+" .food_total label").text("Food Total ("+(Gozintas.tip.general*100).toFixed()+"% tip rate)")
                        $("#page5 #group-"+(i+1)+" #food_total").val(+five_foodTotal)
                        
                       $("#page5 #group-"+(i+1)+" #drinks_deserts_amount_container label").text("Drinks/Deserts/Etc ("+(Gozintas.tip.general*100).toFixed()+"% tip rate)")

                       $("#page5 #group-"+(i+1)+" #wine_amount_container label").text("Wine ("+(Gozintas.tip.wine*100).toFixed()+"% tip rate)")

                       $("#page5 #group-"+(i+1)+" #carry_out_amount_container label").text("Carry-out for group ("+(Gozintas.tip.carryout*100).toFixed()+"% tip rate)")
                        $("#page5 #group-"+(i+1)+" #total_individual").val((+five_finalTotal/+groups[i].peopleInParty).toFixed(2))
                        $("#page5 #group-"+(i+1)+" .tax_total label").text("Tax for group ("+(Gozintas.tip.tax*100).toFixed()+"% tip rate)")
                        $("#page5 #group-"+(i+1)+" #tax_total").val(+groups[i].taxTotal)
                        
                        $("#page5 #group-"+(i+1)+" #tip_total").val(five_tipTotal)
                        $("#page5 #group-"+(i+1)+" #tip_individual").val((five_tipTotal/groups[i].peopleInParty).toFixed(2))
                        Gozintas.showPageFiveGroupInputs(i);
                    }
                }
            );

		},

		page5b: function() {
            $("#page5b").live(
                "pagebeforeshow",
                function () {
                    if(Gozintas.billPath == "determine-tip" || (Gozintas.billPath == "split-tip" && Gozintas.splitBy == "individual")){
                        groups[0].foodTotal = +Gozintas.total.amount - +Gozintas.total.taxAmount
                    }

                    Gozintas.showPageFiveBInputs();
                }
            );
		}


	}

}

