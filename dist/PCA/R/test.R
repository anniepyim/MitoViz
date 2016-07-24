#!/usr/bin/env Rscript
args = commandArgs(trailingOnly=TRUE)

if (length(args)==0) {
  stop("At least one argument must be supplied (input file).n", call.=FALSE)
} else if (length(args)==1) {
  filelist = args[1:length(args)]
}

#filelist = c("TCGA-BH-A0B3.json","TCGA-BH-A0BM.json","TCGA-BH-A0E0.json","TCGA-BH-A0HK.json")
targetoutpath = "../pcas/"

if (exists("merged")) rm(merged)
for (file in filelist){
  
  test <- fromJSON(file)
  sampleID <- test[1,"sampleID"]
  
  # if the merged dataset doesn't exist, create it
  if (!exists("merged")){
    merged <- test[,c("gene","process","log2")]
    colnames(merged) <- c("gene","process",sampleID)
  }
  
  # if the merged dataset does exist, append to it
  else if (exists("merged")){
    test <- test[,c("gene","log2")]
    colnames(test) <- c("gene",sampleID)
    merged <- (merge(merged, test, by = 'gene'))
  }
  
}

data <- merged[!duplicated(merged[1:2]),]
clinical <- read.table("clinical-modified.txt",header=TRUE,sep="\t",check.names="FALSE")
clin <- clinical[,c("sampleID","Cancer_type","Gender","Pathologic_stage")]
colnames(clin) <- c("sampleID","group","gender","stage")

# PCA
log2fold.all.mito <- data[,3:length(data)]
pca <- prcomp(t(log2fold.all.mito))
sampleID <- rownames(pca$x[,1:3])
sum <- cbind(sampleID, pca$x[,1:3])
rownames(sum) <- NULL
sum <- as.data.frame(sum)
df<- merge(sum,clin,by="sampleID")
dfjson <- toJSON(df)
outputname <- paste(targetoutpath,"All Processes-pca.txt", sep="")
write(dfjson,outputname)

# PCA for each functions
mitofunc <- unique(data[,"process"])
for(i in 1:length(mitofunc)){
  subsetdata <- subset(data, process==mitofunc[i])[,3:length(data)]
  if (nrow(subsetdata) >= 3){
    pca <- prcomp(t(subsetdata),scale.=TRUE, center=TRUE)
    sampleID <- rownames(pca$x[,1:3])
    sum <- cbind(sampleID, pca$x[,1:3])
    sum <- as.data.frame(sum)
    df<- merge(sum,clin,by="sampleID")
    dfjson <- toJSON(df)
    outputname <- paste(targetoutpath,mitofunc[i],"-pca.txt", sep="")
    write(dfjson,outputname)
  }
}

