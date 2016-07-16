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
$samplename = $_POST['samplename'];


//creating tables
$query = "DROP TABLE IF EXISTS `expression`";
$s=mysql_query($query, $connect);

$quer = "create table expression (Gene_name varchar(50), Expression_Sample_1 float NOT NULL DEFAULT '0.00', Expression_Sample_2 float NOT NULL DEFAULT '0.00', log2fold_change float NOT NULL DEFAULT '0.00', p_value float NOT NULL DEFAULT '0.00')";
$s=mysql_query($quer, $connect);

$que = ("load data local infile '../data/user_uploads/raw_files/".$id."_exp.txt' into table expression FIELDS TERMINATED BY '\t' LINES TERMINATED BY '\n' (@gene, @val1, @val2, @foch, @pval) set Gene_name = @gene, Expression_Sample_1 = @val1, Expression_Sample_2 = @val2, log2fold_change = @foch, p_value = @pval;");
$z=mysql_query($que, $connect);

$function = "DROP TABLE IF EXISTS `function`";
$t=mysql_query($function, $connect);
$funct="create table function (Gene_function varchar(1000), Process varchar(100), Gene_id varchar(50), Link varchar(1000))";
$t=mysql_query($funct, $connect);
$func = ("load data local infile 'human/function_and_links.json' into table function FIELDS TERMINATED BY '\t' LINES TERMINATED BY '\n' IGNORE 1 LINES (@gene_function, @process, @gene_id, @link) set Gene_function = @gene_function, Process = @process, Gene_id = @gene_id, Link = @link;");
$u=mysql_query($func, $connect);



$mutants = "DROP TABLE IF EXISTS variant";
$m=mysql_query($mutants, $connect);
$mutant="create table variant (Gene_mutname varchar(150), Chromosome_number varchar(50), Reference_position bigint, Reference_base varchar(1000), Reference_variant varchar(1000), Varinat_type varchar(100), Mutation_type varchar(100))";
$m=mysql_query($mutant, $connect);
//---------------------------modified on december 18th
$mutan=("load data local infile '../data/user_uploads/raw_files/".$id."_var.txt' into table variant FIELDS TERMINATED BY '\t' LINES TERMINATED BY '\n' (@gene_name, @chrmo, @position, @reference, @variant, @varianttype, @variantname) set Gene_mutname = @gene_name, Chromosome_number = @chrmo, Reference_position = @position, Reference_base = @reference, Reference_variant = @variant, Varinat_type = @varianttype, Mutation_type = @variantname;");  
$n=mysql_query($mutan, $connect);

$ensgformat = "DROP TABLE IF EXISTS ensgformat";
$ensg=mysql_query($ensgformat, $connect);
$ensgform = "create table ensgformat (Gene_ename varchar(500), ensg_symbol varchar(500))";
$ensg=mysql_query($ensgform, $connect);
$ensgforms=("load data local infile 'human/ensg.txt' into table ensgformat FIELDS TERMINATED BY '\t' LINES TERMINATED BY '\n' (@gene_esname, @ensgsymbol) set Gene_ename = @gene_esname, ensg_symbol = @ensgsymbol;");
$ensgf=mysql_query($ensgforms, $connect);

$mutantformat = "DROP TABLE IF EXISTS variantformat";
$mt=mysql_query($mutantformat, $connect);
$mutform = "create table variantformat (Gene_varname varchar(500), Chromosome_number varchar(50), Variants varchar(20000))";
$mt=mysql_query($mutform, $connect);
$mtform="INSERT INTO variantformat (Gene_varname, Chromosome_number, Variants) SELECT Gene_mutname, Chromosome_number, GROUP_CONCAT(Reference_position,' ',Reference_base,'/',Reference_variant,': ',Varinat_type,': ', Mutation_type SEPARATOR', ') from variant GROUP BY Gene_mutname";
$mutf=mysql_query($mtform, $connect);


//Added on 23rd april 2015
$result_json = "DROP TABLE IF EXISTS result";
$re = mysql_query($result_json, $connect);
$reform = "create table result (Res_geneid varchar(50), Res_gene_function varchar(1000), Res_process varchar(100), Res_expression_1 float NOT NULL DEFAULT '0.00', Res_expression_2 float NOT NULL DEFAULT '0.00', Res_log2fold float NOT NULL DEFAULT '0.00', Res_pvalue float NOT NULL DEFAULT '0.00', Res_chromosome_number varchar(50), Res_variants varchar(20000), Res_ensg_symbol varchar(500))";
$re = mysql_query($reform, $connect);
$result = "insert into result (Res_geneid, Res_gene_function, Res_process, Res_expression_1, Res_expression_2, Res_log2fold, Res_pvalue, Res_chromosome_number, Res_variants,Res_ensg_symbol) select Gene_id, Gene_function, Process, Expression_Sample_1, Expression_Sample_2, log2fold_change, p_value, Chromosome_number, Variants, ensg_symbol from function left join expression on function.Gene_id = expression.Gene_name left join variantformat on function.Gene_id = variantformat.Gene_varname left join ensgformat on function.Gene_id = ensgformat.Gene_ename where Expression_Sample_1";
$result_form = mysql_query($result, $connect);

//if(! $mutf )
if(! $result_form)
{
  die('Could not enter data: ' . mysql_error());
}
//echo "Entered data successfully\n";

$json = "select Res_geneid, Res_gene_function, Res_process, Res_expression_1, Res_expression_2, Res_log2fold, Res_pvalue, Res_chromosome_number, Res_variants,Res_ensg_symbol from result";
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
$fp = fopen('../data/user_uploads/json_files/'.$samplename.'.json', 'w');

 fprintf($fp, "[\n");
while ( $row = mysql_fetch_assoc( $result))
{ 
	 fprintf($fp, $prefix . " {\n");
	fprintf($fp,'  "gene": "' . $row['Res_geneid'] . '",' . "\n");
	fprintf($fp,'  "sampleID": "' . $samplename . '",' . "\n");
fprintf($fp,'  "chr": "' . $row['Res_chromosome_number'] . '",' . "\n");
	fprintf($fp,'  "process": "' . $row['Res_process'] . '",' . "\n");
         fprintf($fp,'  "gene_function": "' . $row['Res_gene_function'] . '",' . "\n");
         fprintf($fp,'  "EMBL_ID": "' . $row['Res_ensg_symbol'] . '",' . "\n");

	fprintf($fp,'  "Normal": ' . $row['Res_expression_1'] . ',' . "\n");
         fprintf($fp,'  "Abnormal": ' . $row['Res_expression_2'] . ',' . "\n");
         fprintf($fp,'  "log2": ' . $row['Res_log2fold'] . ',' . "\n");
         fprintf($fp,'  "pvalue": ' . $row['Res_pvalue'] . ',' . "\n");
         fprintf($fp,'  "mutation": "' . $row['Res_variants'] . '"' . "\n");
	 fprintf($fp," }");
	$prefix = ",\n";
}
 fprintf($fp,"\n]");



?>
