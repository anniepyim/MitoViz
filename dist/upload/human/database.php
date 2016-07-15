<?php 
session_start();
//-----------------modified on december 18th 
$id = session_id();
//-----------------------------------------
//database connection details
//echo "Let us start";
$connect = mysql_connect('localhost','root', '', 'false', '128');
$query='set global group_concat_max_len = 150000';
$que=mysql_query($query);

//echo" Let us start again";
if (!$connect) 
{
	 die('Could not connect to MySQL: ' . mysql_error());
}
 else
{
	 //echo "Connected\n";
} 
//your database name
$cid =mysql_select_db('test',$connect);


//creating tables
$query = "DROP TABLE IF EXISTS `expression`";
$s=mysql_query($query, $connect);
//$quer = "create table expression (Gene_name varchar(50), Expression_Sample_1 float, Expression_Sample_2 float, log2fold_change float, p_value float)";
$quer = "create table expression (Gene_name varchar(50), Expression_Sample_1 float NOT NULL DEFAULT '0.00', Expression_Sample_2 float NOT NULL DEFAULT '0.00', log2fold_change float NOT NULL DEFAULT '0.00', p_value float NOT NULL DEFAULT '0.00')";
$s=mysql_query($quer, $connect);
//--------------------------modified on december 18th
/*$que = ("load data local infile '/home/pkoti/mitomodel/www/uploads/new_exp_input.txt' into table expression FIELDS TERMINATED BY '\t' LINES TERMINATED BY '\n' (@gene, @val1, @val2, @foch) set Gene_name = @gene, Expression_Sample_1 = @val1, Expression_Sample_2 = @val2, log2fold_change = @foch;");*/

//--------------------------modified on 24 february 2015
/*$que = ("load data local infile '/home/pkoti/mitomodel/www/uploads/".$id."new_exp_input.txt' into table expression FIELDS TERMINATED BY '\t' LINES TERMINATED BY '\n' (@gene, @val1, @val2, @foch) set Gene_name = @gene, Expression_Sample_1 = @val1, Expression_Sample_2 = @val2, log2fold_change = @foch;");*/

$que = ("load data local infile '/Users/ayim/Sites/MitoViz/dist/data/user_uploads/raw_files/".$id."new_exp_input.txt' into table expression FIELDS TERMINATED BY '\t' LINES TERMINATED BY '\n' (@gene, @val1, @val2, @foch, @pval) set Gene_name = @gene, Expression_Sample_1 = @val1, Expression_Sample_2 = @val2, log2fold_change = @foch, p_value = @pval;");
$z=mysql_query($que, $connect);

$function = "DROP TABLE IF EXISTS `function`";
$t=mysql_query($function, $connect);
$funct="create table function (Gene_function varchar(1000), Process varchar(100), Gene_id varchar(50), Link varchar(1000))";
$t=mysql_query($funct, $connect);
$func = ("load data local infile '/Users/ayim/Sites/MitoViz/dist/upload/human/function_and_links.json' into table function FIELDS TERMINATED BY '\t' LINES TERMINATED BY '\n' IGNORE 1 LINES (@gene_function, @process, @gene_id, @link) set Gene_function = @gene_function, Process = @process, Gene_id = @gene_id, Link = @link;");
$u=mysql_query($func, $connect);


$target = "DROP TABLE IF EXISTS target";
$v=mysql_query($target, $connect);
$targe="create table target (Source varchar(100), Target varchar(100))";
$v=mysql_query($targe, $connect);
$targ= ("load data local infile '/Users/ayim/Sites/MitoViz/dist/upload/human/source_target.json' into table target FIELDS TERMINATED BY '\t' LINES TERMINATED BY '\n' (@source, @target) set Source = @source, Target = @target;");
$w=mysql_query($targ, $connect);

$mutants = "DROP TABLE IF EXISTS variant";
$m=mysql_query($mutants, $connect);
$mutant="create table variant (Gene_mutname varchar(150), Chromosome_number varchar(50), Reference_position bigint, Reference_base varchar(1000), Reference_variant varchar(1000), Varinat_type varchar(100), Mutation_type varchar(100))";
$m=mysql_query($mutant, $connect);
//---------------------------modified on december 18th
$mutan=("load data local infile '/Users/ayim/Sites/MitoViz/dist/data/user_uploads/raw_files/".$id."new_var_input.txt' into table variant FIELDS TERMINATED BY '\t' LINES TERMINATED BY '\n' (@gene_name, @chrmo, @position, @reference, @variant, @varianttype, @variantname) set Gene_mutname = @gene_name, Chromosome_number = @chrmo, Reference_position = @position, Reference_base = @reference, Reference_variant = @variant, Varinat_type = @varianttype, Mutation_type = @variantname;");  
$n=mysql_query($mutan, $connect);

/* $mutan=("load data local infile '/home/pkoti/mitomodel/www/uploads/new_var_input.txt' into table variant FIELDS TERMINATED BY '\t' LINES TERMINATED BY '\n' (@gene_name, @chrmo, @position, @reference, @variant, @varianttype, @variantname) set Gene_mutname = @gene_name, Chromosome_number = @chrmo, Reference_position = @position, Reference_base = @reference, Reference_variant = @variant, Varinat_type = @varianttype, Mutation_type = @variantname;"); */

$mutantformat = "DROP TABLE IF EXISTS variantformat";
$mt=mysql_query($mutantformat, $connect);
$mutform = "create table variantformat (Gene_varname varchar(500), Chromosome_number varchar(50), Variants varchar(20000))";
$mt=mysql_query($mutform, $connect);
$mtform="INSERT INTO variantformat (Gene_varname, Chromosome_number, Variants) SELECT Gene_mutname, Chromosome_number, GROUP_CONCAT(Reference_position,' ',Reference_base,'/',Reference_variant,': ',Varinat_type,': ', Mutation_type SEPARATOR', ') from variant GROUP BY Gene_mutname";
$mutf=mysql_query($mtform, $connect);


//Added on 23rd april 2015
$result_json = "DROP TABLE IF EXISTS result";
$re = mysql_query($result_json, $connect);
$reform = "create table result (Res_geneid varchar(50), Res_gene_function varchar(1000), Res_process varchar(100), Res_expression_1 float NOT NULL DEFAULT '0.00', Res_expression_2 float NOT NULL DEFAULT '0.00', Res_log2fold float NOT NULL DEFAULT '0.00', Res_pvalue float NOT NULL DEFAULT '0.00', Res_chromosome_number varchar(50), Res_variants varchar(20000))";
$re = mysql_query($reform, $connect);
$result = "insert into result (Res_geneid, Res_gene_function, Res_process, Res_expression_1, Res_expression_2, Res_log2fold, Res_pvalue, Res_chromosome_number, Res_variants) select Gene_id, Gene_function, Process, Expression_Sample_1, Expression_Sample_2, log2fold_change, p_value, Chromosome_number, Variants from function left join expression on function.Gene_id = expression.Gene_name left join variantformat on function.Gene_id = variantformat.Gene_varname where Expression_Sample_1";
$result_form = mysql_query($result, $connect);

//if(! $mutf )
if(! $result_form)
{
  die('Could not enter data: ' . mysql_error());
}
//echo "Entered data successfully\n";

// Fetch the data
//$json = "select expression.Gene_name, function.Gene_function, Gene_id, Expression_Sample_1, Expression_Sample_2, log2fold_change, Process from expression join function on expression.Gene_name = function.Gene_id ";
//$json = "select Gene_id, Gene_function, Process, Expression_Sample_1, Expression_Sample_2, log2fold_change from function left join expression on function.Gene_id = expression.Gene_name";
//$json = "select Gene_id, Gene_function, Process, Expression_Sample_1, Expression_Sample_2, log2fold_change, p_value, Chromosome_number, Variants from function left join expression on function.Gene_id = expression.Gene_name left join variantformat on function.Gene_id = variantformat.Gene_varname";
$json = "select Res_geneid, Res_gene_function, Res_process, Res_expression_1, Res_expression_2, Res_log2fold, Res_pvalue, Res_chromosome_number, Res_variants from result";
$result = mysql_query($json);
$json_link = "select Source, Target from target";
$target_result=mysql_query($json_link);

// All good?
if ( !$result ) 
{
  // Nope
  $message  = 'Invalid query: ' . mysql_error() . "\n";
  $message .= 'Whole query: ' . $query;
  die( $message );
}


$id = session_id();
$prefix = '';
$fp = fopen('/Users/ayim/Sites/MitoViz/dist/data/user_uploads/json_files/'.$id.'.json', 'w');

 fprintf($fp, "{\n");
 fprintf($fp,'"nodes": [');
 fprintf($fp,"\n");
while ( $row = mysql_fetch_assoc( $result))
{ 
	 fprintf($fp, $prefix . " {\n");
	 //fprintf($fp,'  "name": "' . $row['Gene_name'] . '",' . "\n");
	 	 //fprintf($fp,'  "name": "' . $row['Gene_id'] . '",' . "\n");
	fprintf($fp,'  "name": "' . $row['Res_geneid'] . '",' . "\n");
	/* fprintf($fp,'  "process": "' . $row['Process'] . '",' . "\n");
	 fprintf($fp,'  "gene_function": "' . $row['Gene_function'] . '",' . "\n");
	 fprintf($fp,'  "id": "' . $row['Gene_id'] . '",' . "\n");*/
	fprintf($fp,'  "process": "' . $row['Res_process'] . '",' . "\n");
         fprintf($fp,'  "gene_function": "' . $row['Res_gene_function'] . '",' . "\n");
         fprintf($fp,'  "id": "' . $row['Res_geneid'] . '",' . "\n");
	// '  "locus": "' . $row['Chromosome_location'] . '",' . "\n";
	 /*fprintf($fp,'  "Normal": "' . $row['Expression_Sample_1'] . '",' . "\n");
	 fprintf($fp,'  "Abnormal": "' . $row['Expression_Sample_2'] . '",' . "\n");
	 fprintf($fp,'  "Log2fold_change": "' . $row['log2fold_change'] . '",' . "\n");
	 fprintf($fp,'  "p_value": "' . $row['p_value'] . '",' . "\n");*/ //23rd april
	fprintf($fp,'  "Normal": ' . $row['Res_expression_1'] . ',' . "\n");
         fprintf($fp,'  "Abnormal": ' . $row['Res_expression_2'] . ',' . "\n");
         fprintf($fp,'  "Log2fold_change": ' . $row['Res_log2fold'] . ',' . "\n");
         fprintf($fp,'  "p_value": ' . $row['Res_pvalue'] . ',' . "\n");
	 //fprintf($fp,'  "Normal": ' . $row['Expression_Sample_1'] . ',' . "\n");
         //fprintf($fp,'  "Abnormal": ' . $row['Expression_Sample_2'] . ',' . "\n");
         //fprintf($fp,'  "Log2fold_change": ' . $row['log2fold_change'] . ',' . "\n");
         //fprintf($fp,'  "p_value": ' . $row['p_value'] . ',' . "\n");
	 /*fprintf($fp,'  "Chromosome_number": "' . $row['Chromosome_number'] . '",' . "\n");
	 fprintf($fp,'  "Variant_sites": "' . $row['Variants'] . '",' . "\n");	*/ // 23rd April
	fprintf($fp,'  "Chromosome_number": "' . $row['Res_chromosome_number'] . '",' . "\n");
         fprintf($fp,'  "Variant_sites": "' . $row['Res_variants'] . '",' . "\n");
// '  "link": "' . $row['Link'] . '",' . "\n";
	 fprintf($fp,'  "status": "' . $row['Status'] . '"' . "\n");
	 fprintf($fp," }");
	$prefix = ",\n";
}
 fprintf($fp,"\n],\n");
$prefixed = '';
 fprintf($fp,'"links": [');;
 fprintf($fp,"\n");;
while ($roe = mysql_fetch_assoc( $target_result ) )
{
	 fprintf($fp, $prefixed . " {");
	 fprintf($fp,'  "source":"' . $roe['Source'] . '",' );
	 fprintf($fp,'  "target":"' . $roe['Target'] . '"' );
	 fprintf($fp," }");
	$prefixed = ",\n";
}
 fprintf($fp,"\n]\n");
 fprintf($fp,"}");



?>
