library(jsonlite)
library(heatmaply)

args = commandArgs(trailingOnly=TRUE)
sessionid = args[1]
targetin <- paste("../data/user_uploads/",sessionid,"/combined-heatmap.csv",sep="")
data <- read.csv(targetin, header=TRUE,sep=",",check.names="FALSE")
targetoutpath <- paste("../data/user_uploads/",sessionid,"/heatmap/",sep="")

setwd(targetoutpath)
mitofunc <- unique(data[,"process"])
for(i in 1:length(mitofunc)){
  subsetdata <- subset(data,process==mitofunc[i])
  
  rownames(subsetdata) <- subsetdata[,1]
  subsetdata <- subsetdata[,3:ncol(subsetdata)]
    
  remove <- which(apply(subsetdata,1,function(x){
    rmd <- sum(is.na(x)) > length(x)*0.5      
    return (rmd)
  }))
  subsetdata <- subsetdata[-remove,]

  if (nrow(subsetdata) >= 3){  
    outputname <- paste(mitofunc[i],".html",sep="")
    
    p <- heatmaply(subsetdata,subplot_widths=c(0.9, 0.1),subplot_heights=c(0.1, 0.9),scale_fill_gradient_fun = ggplot2::scale_fill_gradient2(low = "blue", high = "red", midpoint = 0)) %>% layout(margin = list(l = 130, b = 100),xaxis=list(tickfont=list(size=7),tickangle=270),yaxis2=list(tickfont=list(size=5)))
    
    htmlwidgets::saveWidget(p, outputname, selfcontained=FALSE)
  }

}

