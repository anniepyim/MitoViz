#!/usr/bin/env Rscriptlen
library(jsonlite)


args = commandArgs(trailingOnly=TRUE)
targetoutpath = "../data/PCA/"

# Get filenames and type of files from arguments
if (length(args) <= 1) {
  #stop("At least one argument must be supplied (input file).n", call.=FALSE)
  filelist = c("test/HCT116-21-3-c1.json","test/HCT116-5-4-p.json","test/HCT116-5-4.json","test/HCT116-8-3-c3.json")
  type = "aneuploidy"
} else if (length(args)>1) {
  filelist = args[2:length(args)]
  type = args[1]
}

# Read in data by either from local (tcga data) or directly from server
if (type == "TCGA"){
  
  datalist = lapply(filelist,function(x){
    test <- fromJSON(x)
    test[1,"sampleID"]
  })
  
  all <- read.table("tcga.txt", header=TRUE,sep="\t",check.names="FALSE")
  datalist <- unlist(datalist)
  data <- all[,c("gene","process",datalist)]
  
}else{
  
  datalist = lapply(filelist,function(x){
    test <- fromJSON(x)
    sampleID <- test[1,"sampleID"]
    test <- test[,c("gene","process","log2")]
    test[,3] <- round(test[,3],3)
    colnames(test) <- c("gene","process",sampleID)
    test
  })
  
  data = Reduce(function(x,y) {
    merge(x,y)
  }, datalist)
  
}

# Read clinical/info of files
if (type == "TCGA"){
  clinical <- read.table("tcga-data.txt",header=TRUE,sep="\t",check.names="FALSE")
  info <- clinical[,c("sampleID","Cancer_type","Gender","Pathologic_stage","Vital_status","BRCA_cancer_factor_3neg")]
  colnames(info) <- c("sampleID","group","gender","stage","vital","neg3")
}else if (type == "aneuploidy"){
  info <- read.table("aneuploidy-data.txt",header=TRUE,sep="\t",check.names="FALSE")
}

# Assign URL to each sample
url = do.call("rbind", lapply(filelist,function(x){
  test <- fromJSON(x)
  sampleID <- test[1,"sampleID"]
  c(sampleID,substring(x,2))
}))
colnames(url) <- c("sampleID","url")


# PCA
log2fold.all.mito <- data[,3:length(data)]
pca <- prcomp(t(log2fold.all.mito))
sampleID <- rownames(pca$x[,1:3])
sum <- cbind(sampleID, pca$x[,1:3])
rownames(sum) <- NULL
sum <- as.data.frame(sum)
df <- sum

if (type == 'TCGA' || type == "aneuploidy"){
  df<- merge(df,info,by="sampleID")
}

df<- merge(df,url,by="sampleID")
df$PC1 <- as.numeric(as.character(df$PC1))
df$PC2 <- as.numeric(as.character(df$PC2))
df$PC3 <- as.numeric(as.character(df$PC3))

dfjsonall <- toJSON(df)
outputname <- paste(targetoutpath,"All Processes-pca.json", sep="")
write(dfjsonall,outputname)

# PCA for each functions
mitofunc <- unique(data[,"process"])
for(i in 1:length(mitofunc)){
  subsetdata <- subset(data, process==mitofunc[i])[,3:length(data)]
  if (nrow(subsetdata) >= 3){
    pca <- prcomp(t(subsetdata))
    sampleID <- rownames(pca$x[,1:3])
    sum <- cbind(sampleID, pca$x[,1:3])
    rownames(sum) <- NULL
    sum <- as.data.frame(sum)
    df <- sum
    
    if (type == 'TCGA' || type == "aneuploidy"){
      df<- merge(df,info,by="sampleID")
    }
    
    df<- merge(df,url,by="sampleID")
    df$PC1 <- as.numeric(as.character(df$PC1))
    df$PC2 <- as.numeric(as.character(df$PC2))
    df$PC3 <- as.numeric(as.character(df$PC3))
    


    dfjson <- toJSON(df)
    outputname <- paste(targetoutpath,mitofunc[i],"-pca.json", sep="")
    write(dfjson,outputname)
  }
}

# Just for converting previous files into appropriate jsons
#for(i in 3:length(all)){
#  test <- all[,c(1,i)]
#  sampleID <- colnames(test)[2]
#  colnames(test) <- c("gene","log2")
#  merged <- (merge(test, genefunc, by = 'gene'))
#  Normal <- rep("0",nrow(merged))
#  Abnormal <- rep("0",nrow(merged))
#  pvalue <- rep("0",nrow(merged))
#  mutation <- rep("",nrow(merged))
#  sampleID <- rep(sampleID,nrow(merged))
#  final <- cbind(merged,sampleID,Normal,Abnormal,pvalue,mutation)
#  dfjson <- toJSON(final)
#  outputname <- paste("test/",sampleID[1],".json", sep="")
#  write(dfjson,outputname)
#}



